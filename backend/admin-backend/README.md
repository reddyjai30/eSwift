eSwift Admin Backend (JavaScript)

Setup

- Copy `.env` from `.env` or adjust variables.
- Install deps: `npm install`
- Seed admin: `npm run seed:admin -- <username> <password>`
- Run dev: `npm run dev`

Postman Collection

- Import `backend/admin-backend/postman/eswift-admin-backend.postman_collection.json` into Postman.
- Set `{{baseUrl}}` to `http://localhost:5001` (collection variable already defaults to this).
- Use the requests in order: Login → Create Restaurant → Presign → S3 PUT → Create Menu Item → Set Menu Item Image.

Key Endpoints (prefix `/api`)

- POST `/admin/auth/login` { username, password }
- GET `/admin/auth/me` (Bearer token)
- PATCH `/admin/auth/password` { oldPassword, newPassword }

- POST `/admin/restaurants` { name, address?, logoUrl?, logoKey?, printer? }
- GET `/admin/restaurants`
- GET `/admin/restaurants/:id`
- PATCH `/admin/restaurants/:id` (supports updating `logoKey`/`logoUrl`)
- POST `/admin/restaurants/:id/logo` multipart form-data with field `file`
  - Uploads image to S3 and saves `logoKey`/`logoUrl` on the restaurant
  - Optional query `?deleteOld=true` will delete previous logo from S3 if any
- DELETE `/admin/restaurants/:id`

- POST `/admin/menu/uploads/presign`
  - Body: provide `key` and `contentType`, or let server build a scoped key with:
    - `scope`: `restaurantLogo` | `menuItemImage`
    - `restaurantId`: required for the above scopes
    - `menuItemId`: optional for `menuItemImage`
    - `filename`: original filename to infer extension
    - `contentType`: required
  - Response: `{ key, uploadUrl, publicUrl }`
  - PUT the file to `uploadUrl` with headers: `Content-Type` and `x-amz-acl: public-read`
  
- POST `/admin/menu/uploads/delete` { key }
  - Deletes the object from S3 (restricted to `admin/images/` prefix)
- GET `/admin/menu/:restaurantId`
- POST `/admin/menu/:restaurantId` { name, price, isAvailable?, category?, quantity }
- PATCH `/admin/menu/item/:itemId`
- POST `/admin/menu/:restaurantId/item/:itemId/image` (multipart form-data)
  - Field: `file` (type File). Optional query `?deleteOld=true` to remove old image.
- PATCH `/admin/menu/:restaurantId/item/:itemId/image` (multipart form-data)
  - Same as POST; primarily used to update/replace image. Use `?deleteOld=true` to delete previous.
- DELETE `/admin/menu/:restaurantId/item/:itemId/image`
- DELETE `/admin/menu/item/:itemId`

Image Keys in DB

- Save both S3 `key` and public URL for images.
  - Restaurant: `logoKey`, `logoUrl`
  - Menu Item: `imageKey`, `imageUrl`
  - Keys are scoped under `admin/images/...` for segregation.

Image CRUD Flows

- Create restaurant with logo (simple)
  1) Create: POST `/admin/restaurants` with `{ name, address }`
  2) Upload: POST `/admin/restaurants/:id/logo` (multipart `file`)

- Update restaurant logo (simple)
  - POST `/admin/restaurants/:id/logo` with new `file`. Add `?deleteOld=true` to remove old S3 object.

- Create menu item (JSON-only)
  - POST `/admin/menu/:restaurantId` with `{ name, price, category?, isAvailable?, quantity }`
  - To attach an image later: presign+upload, then POST `/admin/menu/:restaurantId/item/:itemId/image` with `{ imageKey }`

- Update menu item image
  - POST or PATCH `/admin/menu/:restaurantId/item/:itemId/image?deleteOld=true` with multipart `file`
  - Or remove: DELETE `/admin/menu/:restaurantId/item/:itemId/image`

Quantity rules (admin-managed)

- `quantity` reflects available stock.
- Admin adjusts `quantity` via PATCH `/admin/menu/item/:itemId`.
- User order flow should reject orders when requested quantity exceeds available or equals 0 (enforce this in user backend).

Frontend Upload Example (fetch)

```js
async function uploadViaPresign({ token, scope, restaurantId, menuItemId, file }) {
  // 1) ask API for presign
  const presignRes = await fetch("/api/admin/menu/uploads/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ scope, restaurantId, menuItemId, filename: file.name, contentType: file.type })
  }).then(r => r.json());
  if (!presignRes.success) throw new Error(presignRes.message);
  const { key, uploadUrl, publicUrl } = presignRes.data;

  // 2) PUT file to S3
  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type, "x-amz-acl": "public-read" },
    body: file,
  });
  if (!putRes.ok) throw new Error("S3 upload failed");

  // 3) return key + url to save in DB via subsequent API call
  return { key, url: publicUrl };
}
```
