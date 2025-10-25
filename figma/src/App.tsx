import { useState, useEffect } from 'react';
import { AppShell } from './components/AppShell';
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { LoginScreen } from './components/screens/LoginScreen';
import { RestaurantsScreen } from './components/screens/RestaurantsScreen';
import { MenuScreen } from './components/screens/MenuScreen';
import { CartScreen } from './components/screens/CartScreen';
import { OrdersScreen } from './components/screens/OrdersScreen';
import { OrderDetailsScreen } from './components/screens/OrderDetailsScreen';
import { OrderQRScreen } from './components/screens/OrderQRScreen';
import { WalletScreen } from './components/screens/WalletScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { PaymentSuccessScreen } from './components/screens/PaymentSuccessScreen';
import { AnimatedToast, useToast } from './components/AnimatedToast';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

type Screen = 
  | { type: 'welcome' }
  | { type: 'login' }
  | { type: 'restaurants' }
  | { type: 'menu'; restaurantId: string; restaurantName: string }
  | { type: 'cart' }
  | { type: 'payment-success'; orderId: string; amount: number; paymentMethod: string }
  | { type: 'orders' }
  | { type: 'order-details'; orderId: string }
  | { type: 'order-qr'; orderId: string }
  | { type: 'wallet' }
  | { type: 'profile' };

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>({ type: 'welcome' });
  const [activeTab, setActiveTab] = useState<'restaurants' | 'orders' | 'wallet' | 'profile'>('restaurants');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [walletBalance, setWalletBalance] = useState(1250.50);
  const { toast: animatedToast, showToast, hideToast } = useToast();

  // Apply theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleGetStarted = () => {
    setCurrentScreen({ type: 'login' });
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentScreen({ type: 'restaurants' });
    showToast('success', 'Welcome back!', 'You have successfully logged in');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentScreen({ type: 'welcome' });
    toast.success('Logged out successfully');
  };

  const handleTabChange = (tab: 'restaurants' | 'orders' | 'wallet' | 'profile') => {
    setActiveTab(tab);
    switch (tab) {
      case 'restaurants':
        setCurrentScreen({ type: 'restaurants' });
        break;
      case 'orders':
        setCurrentScreen({ type: 'orders' });
        break;
      case 'wallet':
        setCurrentScreen({ type: 'wallet' });
        break;
      case 'profile':
        setCurrentScreen({ type: 'profile' });
        break;
    }
  };

  const handleRestaurantClick = (id: string) => {
    const restaurantNames: Record<string, string> = {
      '1': 'Spice Garden',
      '2': 'Pizza Italiano',
      '3': 'Burger Junction',
      '4': 'Sushi House',
    };
    setCurrentScreen({ 
      type: 'menu', 
      restaurantId: id, 
      restaurantName: restaurantNames[id] || 'Restaurant' 
    });
  };

  const handleViewCart = () => {
    setCurrentScreen({ type: 'cart' });
  };

  const handleCheckout = (useWallet: boolean) => {
    const orderTotal = 994.35;
    const orderId = 'ORD' + Date.now();
    
    if (useWallet) {
      // Wallet payment
      setWalletBalance(prev => prev - orderTotal);
      setCurrentScreen({ 
        type: 'payment-success', 
        orderId,
        amount: orderTotal,
        paymentMethod: 'Wallet'
      });
    } else {
      // Razorpay payment (mock)
      showToast('info', 'Processing payment...', 'Please wait while we process your payment');
      setTimeout(() => {
        setCurrentScreen({ 
          type: 'payment-success', 
          orderId,
          amount: orderTotal,
          paymentMethod: 'Razorpay'
        });
      }, 2000);
    }
  };

  const handleOrderClick = (orderId: string) => {
    setCurrentScreen({ type: 'order-details', orderId });
  };

  const handleViewQR = () => {
    setCurrentScreen({ type: 'order-qr', orderId: '1' });
  };

  const handleRefund = () => {
    setCurrentScreen({ type: 'order-qr', orderId: '1' });
  };

  const handleThemeToggle = () => {
    setIsDarkMode(prev => !prev);
  };

  // Render screen without auth check
  if (!isLoggedIn) {
    if (currentScreen.type === 'welcome') {
      return (
        <>
          <WelcomeScreen onGetStarted={handleGetStarted} />
          <Toaster position="bottom-center" />
        </>
      );
    }
    if (currentScreen.type === 'login') {
      return (
        <>
          <LoginScreen 
            onBack={() => setCurrentScreen({ type: 'welcome' })}
            onLogin={handleLogin}
          />
          <Toaster position="bottom-center" />
        </>
      );
    }
  }

  // Authenticated screens
  const renderScreen = () => {
    switch (currentScreen.type) {
      case 'restaurants':
        return (
          <AppShell
            title="eSwift"
            activeTab={activeTab}
            onTabChange={handleTabChange}
          >
            <RestaurantsScreen onRestaurantClick={handleRestaurantClick} />
          </AppShell>
        );

      case 'menu':
        return (
          <MenuScreen
            restaurantId={currentScreen.restaurantId}
            restaurantName={currentScreen.restaurantName}
            onBack={() => setCurrentScreen({ type: 'restaurants' })}
            onViewCart={handleViewCart}
          />
        );

      case 'cart':
        return (
          <CartScreen
            onBack={() => setCurrentScreen({ type: 'menu', restaurantId: '1', restaurantName: 'Pizza Italiano' })}
            onCheckout={handleCheckout}
            walletBalance={walletBalance}
          />
        );

      case 'orders':
        return (
          <AppShell
            title="Orders"
            activeTab={activeTab}
            onTabChange={handleTabChange}
          >
            <OrdersScreen onOrderClick={handleOrderClick} />
          </AppShell>
        );

      case 'order-details':
        return (
          <OrderDetailsScreen
            orderId={currentScreen.orderId}
            onBack={() => setCurrentScreen({ type: 'orders' })}
            onViewQR={handleViewQR}
            onRefund={handleRefund}
          />
        );

      case 'payment-success':
        return (
          <PaymentSuccessScreen
            orderId={currentScreen.orderId}
            amount={currentScreen.amount}
            paymentMethod={currentScreen.paymentMethod}
            onViewOrder={() => setCurrentScreen({ type: 'order-details', orderId: currentScreen.orderId })}
            onGoHome={() => setCurrentScreen({ type: 'restaurants' })}
          />
        );

      case 'order-qr':
        return (
          <OrderQRScreen
            orderId={currentScreen.orderId}
            onBack={() => setCurrentScreen({ type: 'order-details', orderId: currentScreen.orderId })}
          />
        );

      case 'wallet':
        return (
          <AppShell
            title="Wallet"
            activeTab={activeTab}
            onTabChange={handleTabChange}
          >
            <WalletScreen balance={walletBalance} />
          </AppShell>
        );

      case 'profile':
        return (
          <AppShell
            title="Profile"
            activeTab={activeTab}
            onTabChange={handleTabChange}
          >
            <ProfileScreen
              isDarkMode={isDarkMode}
              onThemeToggle={handleThemeToggle}
              onLogout={handleLogout}
            />
          </AppShell>
        );

      default:
        return (
          <AppShell
            title="eSwift"
            activeTab={activeTab}
            onTabChange={handleTabChange}
          >
            <RestaurantsScreen onRestaurantClick={handleRestaurantClick} />
          </AppShell>
        );
    }
  };

  return (
    <>
      {renderScreen()}
      <AnimatedToast toast={animatedToast} onClose={hideToast} />
      <Toaster position="bottom-center" />
    </>
  );
}
