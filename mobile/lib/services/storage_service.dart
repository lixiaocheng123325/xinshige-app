import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';

class StorageService extends GetxService {
  static StorageService get to => Get.find();
  late final SharedPreferences _prefs;

  Future<StorageService> init() async {
    _prefs = await SharedPreferences.getInstance();
    return this;
  }

  String? getToken() => _prefs.getString('access_token');
  Future<void> setToken(String token) async => await _prefs.setString('access_token', token);
  Future<void> removeToken() async => await _prefs.remove('access_token');

  String? getRefreshToken() => _prefs.getString('refresh_token');
  Future<void> setRefreshToken(String token) async => await _prefs.setString('refresh_token', token);
  Future<void> removeRefreshToken() async => await _prefs.remove('refresh_token');

  Map<String, dynamic>? getUser() {
    final json = _prefs.getString('user_info');
    return json != null ? {'id': json} : null;
  }

  Future<void> setUserInfo(String json) async => await _prefs.setString('user_info', json);
  Future<void> clearAll() async => await _prefs.clear();
}
