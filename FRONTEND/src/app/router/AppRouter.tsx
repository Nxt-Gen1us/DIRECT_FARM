import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "../../components/layout/Layout";
import { PremiumLanding } from "../../pages/landing/PremiumLanding";
import { DesignSystemPage } from "../../pages/foundation/DesignSystemPage";
import { MarketPage } from "../../pages/MarketPage";
import { ProductPage } from "../../pages/ProductPage";
import { LoginPage } from "../../pages/auth/LoginPage";
import { RegisterPage } from "../../pages/auth/RegisterPage";
import { ForgotPasswordPage } from "../../pages/auth/ForgotPasswordPage";
import { FarmerDeskPage } from "../../pages/farmer/FarmerDeskPage";
import { FarmerDirectoryPage, FarmerProfilePage } from "../../pages/farmer/FarmerProfilePage";
import { ProductListPage } from "../../pages/farmer/ProductListPage";
import { ProductEditorPage } from "../../pages/farmer/ProductEditorPage";
import { FarmerOrdersPage } from "../../pages/farmer/FarmerOrdersPage";
import { FarmerEarningsPage } from "../../pages/farmer/FarmerEarningsPage";
import { FarmerFarmPage } from "../../pages/farmer/FarmerFarmPage";
import { FarmerLayout } from "../../components/farmer/FarmerLayout";
import { CartPage } from "../../pages/CartPage";
import { CheckoutPage } from "../../pages/CheckoutPage";
import { OrdersPage } from "../../pages/OrdersPage";
import { OrderDetailPage } from "../../pages/OrderDetailPage";
import { OrderConfirmPage } from "../../pages/OrderConfirmPage";
import { InvoicePage } from "../../pages/InvoicePage";
import { OrderTrackingPage } from "../../pages/OrderTrackingPage";
import { PaymentsPage } from "../../pages/PaymentsPage";
import { ChatPage } from "../../pages/ChatPage";
import { NoticesPage } from "../../pages/NoticesPage";
import { IntelHubPage } from "../../pages/intel/IntelHubPage";
import { WeatherPage } from "../../pages/intel/WeatherPage";
import { RainAlertsPage } from "../../pages/intel/RainAlertsPage";
import { CropCalendarPage } from "../../pages/intel/CropCalendarPage";
import { RemindersPage } from "../../pages/intel/RemindersPage";
import { SchemesPage } from "../../pages/intel/SchemesPage";
import { WishlistPage } from "../../pages/shop/WishlistPage";
import { ComparePage } from "../../pages/shop/ComparePage";
import { BoxPage } from "../../pages/shop/BoxPage";
import { AdminShell } from "../../components/admin/AdminShell";
import { AdminOverviewPage } from "../../pages/admin/AdminOverviewPage";
import { AdminPeoplePage } from "../../pages/admin/AdminPeoplePage";
import { AdminProductsPage } from "../../pages/admin/AdminProductsPage";
import { AdminOrdersPage } from "../../pages/admin/AdminOrdersPage";
import { AdminPaymentsPage } from "../../pages/admin/AdminPaymentsPage";
import { AdminVerifyPage } from "../../pages/admin/AdminVerifyPage";
import { AdminComplaintsPage } from "../../pages/admin/AdminComplaintsPage";
import { AdminReportsPage } from "../../pages/admin/AdminReportsPage";
import { AccountPage } from "../../pages/AccountPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<PremiumLanding />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route element={<Layout />}>
          <Route path="/system" element={<DesignSystemPage />} />
          <Route path="/market" element={<MarketPage />} />
          <Route path="/market/:id" element={<ProductPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/box" element={<BoxPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
          <Route path="/orders/:id/confirm" element={<OrderConfirmPage />} />
          <Route path="/orders/:id/invoice" element={<InvoicePage />} />
          <Route path="/orders/:id/track" element={<OrderTrackingPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/chat/:threadId" element={<ChatPage />} />
          <Route path="/notices" element={<NoticesPage />} />
          <Route path="/passport" element={<Navigate to="/market" replace />} />
          <Route path="/passport/:id" element={<Navigate to="/market" replace />} />
          <Route path="/intel" element={<IntelHubPage />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/weather/alerts" element={<RainAlertsPage />} />
          <Route path="/calendar" element={<CropCalendarPage />} />
          <Route path="/reminders" element={<RemindersPage />} />
          <Route path="/schemes" element={<SchemesPage />} />
          <Route path="/farmers" element={<FarmerDirectoryPage />} />
          <Route path="/farmers/:id" element={<FarmerProfilePage />} />
          <Route path="/admin" element={<AdminShell />}>
            <Route index element={<AdminOverviewPage />} />
            <Route path="users" element={<AdminPeoplePage mode="users" />} />
            <Route path="farmers" element={<AdminPeoplePage mode="farmers" />} />
            <Route path="customers" element={<AdminPeoplePage mode="customers" />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="payments" element={<AdminPaymentsPage />} />
            <Route path="verify" element={<AdminVerifyPage />} />
            <Route path="complaints" element={<AdminComplaintsPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
          </Route>
          <Route path="/account" element={<AccountPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        
        {/* Farmer Specific Layout for /farmer path */}
        <Route path="/farmer" element={<FarmerLayout />}>
          <Route index element={<FarmerDeskPage />} />
          <Route path="products" element={<ProductListPage />} />
          <Route path="products/new" element={<ProductEditorPage />} />
          <Route path="products/:id/edit" element={<ProductEditorPage />} />
          <Route path="orders" element={<FarmerOrdersPage />} />
          <Route path="earnings" element={<FarmerEarningsPage />} />
          <Route path="farm" element={<FarmerFarmPage />} />
          <Route path="weather" element={<WeatherPage />} />
          <Route path="messages" element={<ChatPage />} />
          <Route path="settings" element={<AccountPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
