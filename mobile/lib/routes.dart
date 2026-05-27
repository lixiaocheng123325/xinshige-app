import 'package:get/get.dart';
import 'pages/auth/login_page.dart';
import 'pages/home/home_page.dart';
import 'pages/note/note_detail_page.dart';
import 'pages/note/note_edit_page.dart';
import 'pages/profile/profile_page.dart';
import 'pages/profile/withdrawal_page.dart';
import 'pages/profile/purchase_history_page.dart';

class AppRoutes {
  static const String splash = '/';
  static const String login = '/login';
  static const String home = '/home';
  static const String noteDetail = '/note/detail';
  static const String noteEdit = '/note/edit';
  static const String profile = '/profile';
  static const String withdrawal = '/withdrawal';
  static const String purchaseHistory = '/purchase-history';

  static final List<GetPage> pages = [
    GetPage(name: splash, page: () => const LoginPage()),
    GetPage(name: login, page: () => const LoginPage()),
    GetPage(name: home, page: () => const HomePage()),
    GetPage(name: noteDetail, page: () => const NoteDetailPage()),
    GetPage(name: noteEdit, page: () => const NoteEditPage()),
    GetPage(name: profile, page: () => const ProfilePage()),
    GetPage(name: withdrawal, page: () => const WithdrawalPage()),
    GetPage(name: purchaseHistory, page: () => const PurchaseHistoryPage()),
  ];
}
