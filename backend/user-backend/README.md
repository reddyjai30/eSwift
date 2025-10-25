eSwift User Backend (JavaScript)

Run

- `cd backend/user-backend`
- `cp .env.example .env` and set Mongo + Twilio + CORS
- `npm install`
- `npm run dev`

Auth (phone OTP via Twilio)

- POST `/api/auth/signup/start`
  - { name, phone, email? }
  - Sends 6-digit OTP to phone. Fails if phone already registered.

- POST `/api/auth/signup/verify`
  - { phone, code }
  - Verifies latest OTP (5 min TTL). On success, creates user and returns JWT.

- POST `/api/auth/login/start`
  - { phone }
  - Sends 6-digit OTP. Fails with 404 if user not found (ask to sign up).

- POST `/api/auth/login/verify`
  - { phone, code }
  - On success, returns JWT for existing user.

- GET `/api/auth/me` (Bearer token) → { user }

Restaurants (user read-only; Bearer token)

- GET `/api/restaurants`
  - Returns active restaurants: [{ _id, name, address, logoUrl }]
- GET `/api/restaurants/:id/menu`
  - Query: `?includeUnavailable=1` (default) returns all items; `includeUnavailable=0` returns only orderable items.
  - Returns: { restaurant: { _id, name, address, logoUrl }, items: [{ name, price, category, imageUrl, quantity, isAvailable, canOrder, status, stockMessage }] }
    - `isAvailable`: effective availability (false when quantity==0 or original item disabled)
    - `canOrder`: same as `isAvailable` (true only if quantity>0 and item enabled)
    - `status`: available | low_stock | out_of_stock | unavailable
    - `stockMessage`: e.g., "Hurry up! Only 3 left" when quantity <= 5 and canOrder

Cart (Bearer token)

- GET `/api/cart` → current cart or empty shape
- POST `/api/cart/items`
  - Body: `{ restaurantId, items: [{ itemId, quantity }], replace?: boolean }`
  - If there’s an existing cart for a different restaurant and `replace` is false, 400 with `{ code: "CART_RESTAURANT_MISMATCH", currentRestaurantId }`.
  - Validates availability and caps quantities to available stock.
- PATCH `/api/cart/items` with `{ items: [{ itemId, quantity }] }` to update quantities (0 removes item)
- DELETE `/api/cart/items/:itemId` remove a single item
- DELETE `/api/cart` clear cart

Cart totals

- Recalculated server-side each change.
- `subtotal` = sum(price * qty), `gstPercent` from env (GST_PERCENT, default 5), `gstAmount`, and `total` returned with `currency: INR`.

Payments (Razorpay)

- POST `/api/payments/create-order`
  - Uses current cart; validates stock; reserves stock by decrementing menu item quantities; creates pending Order and Razorpay order.
  - Response: `{ orderId, razorpayOrderId, amount, currency, keyId }`
- POST `/api/payments/verify`
  - Body: `{ orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature }`
  - Verifies signature; marks order `paid`; clears cart.
- POST `/api/payments/cancel`
  - Body: `{ orderId }`
  - Releases reserved stock; marks order `cancelled`.

Env:
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `ORDER_TTL_MINUTES` (default 10)

Notes

- OTP throttle: resend cooldown (default 30s), attempts limited to 5, TTL 5 minutes (TTL index).
- Twilio: use Messaging Service SID (`TWILIO_MESSAGING_SERVICE_SID`) or `TWILIO_FROM`.
- JWT: payload includes { sub, role: 'user', name, phone }.

User Profile (Bearer token)

- GET `/api/user/profile` → { name, phone, email, createdAt, updatedAt }
- PATCH `/api/user/profile` { name?, email? } → updates profile except phone
