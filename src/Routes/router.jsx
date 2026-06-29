import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout/RootLayout";
import HomePage from "../Pages/HomePage/HomePage";
import Coverage from "../Pages/Coverage/Coverage";
import About from "../Pages/About/About";
import PricingCalculator from "../Pages/PricingCalculator/PricingCalculator";
import ContactPage from "../Pages/ContactPage/ContactPage";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import AuthLayout from "../Layouts/AuthLayout/AuthLayout";
import LoginPage from "../Pages/LoginPage/LoginPage";
import SignUp from "../Pages/SignUp/SignUp";
import ForgetPassword from "../Pages/ForgetPassword/ForgetPassword";
import OTPVerify from "../Pages/ForgetPassword/OTPVerify";
import ResetPassword from "../Pages/ForgetPassword/ResetPassword";
import RoleSelection from "../Pages/RoleSelection/RoleSelection";
import RiderRegistration from "../Pages/RiderRegistration/RiderRegistration";
import MerchantRegistration from "../Pages/MerchantRegistration/MerchantRegistration";
import Dashboard from "../Pages/Dashboard/Dashboard";
import PrivateRoute from "./PrivateRoute";
import VerifyEmail from "../Pages/VerifyEmail/VerifyEmail";
import VerifiedUserRoute from "./VerifiedUserRoute";
import ProfilePage from "../Pages/ProfilePage/ProfilePage";
import TrackParcels from "../Pages/TrackParcels/TrackParcels";
import SendParcel from "../Pages/SendParcel/SendParcel";
import DashboardLayout from "../Layouts/DashboardLayout/DashboardLayout";
import UnpaidParcels from "../Pages/UnpaidParcels/UnpaidParcels";
import ReadyToPickUp from "../Pages/ReadyToPickUp/ReadyToPickUp";
import InTransitParcel from "../Pages/InTransitParcel/InTransitParcel";
import ReadyToDeliver from "../Pages/ReadyToDeliver/ReadyToDeliver";
import Delivered from "../Pages/Delivered/Delivered";
import PaymentSuccess from "../Pages/PaymentSuccess/PaymentSuccess";
import PaymentCancelled from "../Pages/PaymentCancelled/PaymentCancelled";
import Deliveries from "../Pages/Deliveries/Deliveries";
import UserManagement from "../Pages/UserManagement/UserManagement";
import RiderRequest from "../Pages/RiderRequest/RiderRequest";
import HubManager from "../Pages/HubManager/HubManager";
import Incoming from "../Pages/Incoming/Incoming";
import MyTaskRider from "../Pages/MyTaskRider/MyTaskRider";
import DisPatchAndDelivery from "../Pages/DisPatchAndDelivery/DisPatchAndDelivery";
import DisPatch from "../Pages/DisPatch/DisPatch";
import DeliveryParcelLocal from "../Pages/DeliveryParcelLocal/DeliveryParcelLocal";
import AllParcelsMerchant from "../Pages/AllParcelsMerchant/AllParcelsMerchant";
import SupportClaim from "../Pages/SupportClaim/SupportClaim";
import StoreSettings from "../Pages/StoreSettings/StoreSettings";
import PaymentPayout from "../Pages/PaymentPayout/PaymentPayout";
import AccountAndFinance from "../Pages/AccountAndFinance/AccountAndFinance";
import PayoutReq from "../Pages/PayoutReq/PayoutReq";
import ParcelDetails from "../Pages/ParcelDetails/ParcelDetails";
import PickUp from "../Pages/PickUp/PickUp";
import InHouse from "../Pages/InHouse/InHouse";
import ReturnParcels from "../Pages/ReturnParcels/ReturnParcels";
import RiderAreaWise from "../Pages/RiderAreaWise/RiderAreaWise";
import MerchantsAreaWise from "../Pages/MerchantsAreaWise/MerchantsAreaWise";
import OutForDelivery from "../Pages/OutForDelivery/OutForDelivery";
import HubDelivered from "../Pages/HubDelivered/HubDelivered";
import HubDepositToHQ from "../Pages/HubDepositToHQ/HubDepositToHQ";
import FinanceAndReport from "../Pages/FinanceAndReport/FinanceAndReport";
import RiderState from "../Components/RiderState/RiderState";
import HoldParcelsForRider from "../Pages/HoldParcelsForRider/HoldParcelsForRider";
import DeliveredParcelsTodayForRider from "../Pages/DeliveredParcelsTodayForRider/DeliveredParcelsTodayForRider";
import CODCollection from "../Pages/CODCollection/CODCollection";
import RiderMyEarning from "../Pages/RiderMyEarning/RiderMyEarning";
import ProfileWallet from "../Pages/ProfileWallet/ProfileWallet";
import AllMerchants from "../Pages/AllMerchants/AllMerchants";
import AllRiders from "../Pages/AllRiders/AllRiders";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: "coverage-area",
        loader: () => fetch("warehouses.json").then((res) => res.json()),
        Component: Coverage,
      },
      {
        path: "about-us",
        Component: About,
      },
      {
        path: "pricing",
        Component: PricingCalculator,
      },
      {
        path: "contact",
        Component: ContactPage,
      },
      {
        path: "track-parcel",
        Component: TrackParcels,
      },
      {
        path: "role-onboarding",
        element: (
          <VerifiedUserRoute>
            <RoleSelection></RoleSelection>
          </VerifiedUserRoute>
        ),
      },
      {
        path: "be-rider",
        loader: () => fetch("warehouses.json").then((res) => res.json()),
        element: (
          <VerifiedUserRoute>
            <RiderRegistration></RiderRegistration>
          </VerifiedUserRoute>
        ),
      },
      {
        path: "be-merchant",
        loader: () => fetch("warehouses.json").then((res) => res.json()),
        element: (
          <VerifiedUserRoute>
            <MerchantRegistration></MerchantRegistration>
          </VerifiedUserRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <VerifiedUserRoute>
            <ProfilePage></ProfilePage>
          </VerifiedUserRoute>
        ),
      },
      {
        path: "verify-email",
        element: (
          <PrivateRoute>
            <VerifyEmail></VerifyEmail>
          </PrivateRoute>
        ),
      },
      // {
      //   path: "send-parcel",
      //   loader: () => fetch("warehouses.json").then((res) => res.json()),
      //   element: (
      //     <SendParcel></SendParcel>
      //     // <VerifiedUserRoute>
      //     // </VerifiedUserRoute>
      //   ),
      // },
    ],
  },
  {
    path: "/auth",
    Component: AuthLayout,
    children: [
      { path: "/auth/login", Component: LoginPage },
      { path: "/auth/sign-up", Component: SignUp },
      { path: "/auth/forget-password", Component: ForgetPassword },
      { path: "/auth/verify-OTP", Component: OTPVerify },
      { path: "/auth/reset-password", Component: ResetPassword },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <VerifiedUserRoute>
        <DashboardLayout></DashboardLayout>
      </VerifiedUserRoute>
      // <DashboardLayout></DashboardLayout>
    ),
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: "hold-parcels",
        Component: HoldParcelsForRider,
      },
      {
        path: "delivered-parcels",
        Component: DeliveredParcelsTodayForRider,
      },
      {
        path: "cod-collection",
        Component: CODCollection,
      },
      {
        path: "profile-wallet",
        Component: ProfileWallet,
      },
      {
        path: "my-earnings",
        Component: RiderMyEarning,
      },
      {
        path: "all-parcels/parcel-detail/:parcelId",
        loader: async ({ params }) =>
          fetch(`http://localhost:5000/parcel/${params.parcelId}`),
        element: <ParcelDetails></ParcelDetails>,
      },
      {
        path: "unpaid-parcel",
        element: <UnpaidParcels></UnpaidParcels>,
      },
      {
        path: "ready-pickup",
        element: <ReadyToPickUp></ReadyToPickUp>,
      },
      {
        path: "in-transit",
        element: <InTransitParcel></InTransitParcel>,
      },
      {
        path: "ready-deliver",
        element: <ReadyToDeliver></ReadyToDeliver>,
      },
      {
        path: "delivered",
        element: <Delivered></Delivered>,
      },
      {
        path: "payment-success",
        element: <PaymentSuccess></PaymentSuccess>,
      },
      {
        path: "payment-cancelled",
        element: <PaymentCancelled></PaymentCancelled>,
      },
      {
        path: "deliveries",
        element: <Deliveries></Deliveries>,
      },
      {
        path: "users",
        element: <UserManagement></UserManagement>,
        children: [
          {
            index: true,
            element: <AllMerchants></AllMerchants>,
          },
          {
            path: "riders",
            element: <AllRiders></AllRiders>,
          },
          {
            path: "rider-request",
            element: <RiderRequest></RiderRequest>,
          },
        ],
      },
      {
        path: "finance-reports",
        Component: FinanceAndReport,
      },
      {
        path: "incoming",
        element: <Incoming></Incoming>,
      },
      {
        path: "in-house",
        element: <InHouse></InHouse>,
      },
      {
        path: "track-parcel",
        Component: TrackParcels,
      },
      {
        path: "area-riders",
        Component: RiderAreaWise,
      },
      {
        path: "hub-delivered",
        Component: HubDelivered,
      },
      {
        path: "area-merchants",
        Component: MerchantsAreaWise,
      },
      {
        path: "out-for-delivery",
        Component: OutForDelivery,
      },
      {
        path: "pick-ups",
        element: <PickUp></PickUp>,
      },
      {
        path: "my-task",
        element: <MyTaskRider></MyTaskRider>,
      },
      {
        path: "return-parcels",
        element: <ReturnParcels></ReturnParcels>,
      },
      {
        path: "create-order",
        loader: () => fetch("/warehouses.json").then((res) => res.json()),
        element: <SendParcel></SendParcel>,
      },
      {
        path: "all-parcels",
        element: <AllParcelsMerchant></AllParcelsMerchant>,
      },
      {
        path: "support",
        element: <SupportClaim></SupportClaim>,
      },
      {
        path: "store-settings",
        element: <StoreSettings></StoreSettings>,
      },
      {
        path: "payment-payout",
        element: <PaymentPayout></PaymentPayout>,
      },
      {
        path: "account-finance",
        element: <AccountAndFinance></AccountAndFinance>,
        children: [
          {
            index: true,
            element: <PayoutReq />,
          },
          {
            path: "deposits-hq",
            Component: HubDepositToHQ,
          },
        ],
      },
      {
        path: "dispatch-delivery",
        element: <DisPatchAndDelivery></DisPatchAndDelivery>,
        children: [
          { index: true, element: <DisPatch></DisPatch> },
          {
            path: "delivery-local",
            element: <DeliveryParcelLocal></DeliveryParcelLocal>,
          },
        ],
      },
      {
        path: "hubs",
        loader: () => fetch("/warehouses.json").then((res) => res.json()),
        Component: HubManager,
      },
    ],
  },
  {
    path: "*",
    Component: ErrorPage,
  },
]);
