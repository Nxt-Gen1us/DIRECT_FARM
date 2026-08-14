import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "../../components/layout/Layout";
import { LandingPage } from "../../pages/landing/LandingPage";
import { DesignSystemPage } from "../../pages/foundation/DesignSystemPage";
import { MarketPage } from "../../pages/MarketPage";
import { ProductPage } from "../../pages/ProductPage";
import { PassportIndexPage, PassportDetailPage } from "../../pages/PassportPage";
import { LoginPage } from "../../pages/auth/LoginPage";
import { RegisterPage } from "../../pages/auth/RegisterPage";
import { ForgotPasswordPage } from "../../pages/auth/ForgotPasswordPage";
import { FarmerDeskPage } from "../../pages/farmer/FarmerDeskPage";
import { FarmerDirectoryPage, FarmerProfilePage } from "../../pages/farmer/FarmerProfilePage";
import { ProductListPage } from "../../pages/farmer/ProductListPage";
import { ProductEditorPage } from "../../pages/farmer/ProductEditorPage";
import { AiPage } from "../../pages/AiPage";
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
import { MapDeskPage } from "../../pages/map/MapDeskPage";
import { TrackCratePage } from "../../pages/map/TrackCratePage";
import { IntelHubPage } from "../../pages/intel/IntelHubPage";
import { WeatherPage } from "../../pages/intel/WeatherPage";
import { RainAlertsPage } from "../../pages/intel/RainAlertsPage";
import { CropCalendarPage } from "../../pages/intel/CropCalendarPage";
import { RemindersPage } from "../../pages/intel/RemindersPage";
import { SchemesPage } from "../../pages/intel/SchemesPage";
import { WishlistPage } from "../../pages/shop/WishlistPage";
import { ComparePage } from "../../pages/shop/ComparePage";
import { BoxPage } from "../../pages/shop/BoxPage";
import { SustainabilityPage } from "../../pages/SustainabilityPage";
import { AdminShell } from "../../components/admin/AdminShell";
import { AdminOverviewPage } from "../../pages/admin/AdminOverviewPage";
import { AdminPeoplePage } from "../../pages/admin/AdminPeoplePage";
import { AdminProductsPage } from "../../pages/admin/AdminProductsPage";
import { AdminOrdersPage } from "../../pages/admin/AdminOrdersPage";
import { AdminPaymentsPage } from "../../pages/admin/AdminPaymentsPage";
import { AdminVerifyPage } from "../../pages/admin/AdminVerifyPage";
import { AdminComplaintsPage } from "../../pages/admin/AdminComplaintsPage";
import { AdminReportsPage } from "../../pages/admin/AdminReportsPage";
import { AdminAiPage } from "../../pages/admin/AdminAiPage";
import { AdminSustainPage } from "../../pages/admin/AdminSustainPage";
import { PremiumHubPage } from "../../pages/premium/PremiumHubPage";
import { AuctionPage } from "../../pages/premium/AuctionPage";
import { CommunityPage } from "../../pages/premium/CommunityPage";
import { ExpertsPage } from "../../pages/premium/ExpertsPage";
import { ForecastPage } from "../../pages/premium/ForecastPage";
import { ContractsPage } from "../../pages/premium/ContractsPage";
import { EquipmentPage } from "../../pages/premium/EquipmentPage";
import { StorePage } from "../../pages/premium/StorePage";
import { AccountPage } from "../../pages/AccountPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
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
          <Route path="/map" element={<MapDeskPage mode="atlas" />} />
          <Route path="/map/farmers" element={<MapDeskPage mode="farmers" />} />
          <Route path="/map/customers" element={<MapDeskPage mode="customers" />} />
          <Route path="/map/farms" element={<MapDeskPage mode="farms" />} />
          <Route path="/map/lots" element={<MapDeskPage mode="lots" />} />
          <Route path="/map/routes" element={<MapDeskPage mode="routes" />} />
          <Route path="/map/live" element={<MapDeskPage mode="live" />} />
          <Route path="/map/track/:orderId" element={<TrackCratePage />} />
          <Route path="/ai" element={<AiPage />} />
          <Route path="/passport" element={<PassportIndexPage />} />
          <Route path="/passport/:id" element={<PassportDetailPage />} />
          <Route path="/intel" element={<IntelHubPage />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/weather/alerts" element={<RainAlertsPage />} />
          <Route path="/calendar" element={<CropCalendarPage />} />
          <Route path="/reminders" element={<RemindersPage />} />
          <Route path="/schemes" element={<SchemesPage />} />
          <Route path="/sustainability" element={<SustainabilityPage />} />
          <Route path="/premium" element={<PremiumHubPage />} />
          <Route path="/premium/auction" element={<AuctionPage />} />
          <Route path="/premium/community" element={<CommunityPage />} />
          <Route path="/premium/experts" element={<ExpertsPage />} />
          <Route path="/premium/forecast" element={<ForecastPage />} />
          <Route path="/premium/contracts" element={<ContractsPage />} />
          <Route path="/premium/equipment" element={<EquipmentPage />} />
          <Route path="/premium/warehouse" element={<StorePage kind="warehouse" />} />
          <Route path="/premium/cold" element={<StorePage kind="cold" />} />
          <Route path="/farmer" element={<FarmerDeskPage />} />
          <Route path="/farmer/products" element={<ProductListPage />} />
          <Route path="/farmer/products/new" element={<ProductEditorPage />} />
          <Route path="/farmer/products/:id/edit" element={<ProductEditorPage />} />
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
            <Route path="ai" element={<AdminAiPage />} />
            <Route path="sustain" element={<AdminSustainPage />} />
          </Route>
          <Route path="/account" element={<AccountPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
