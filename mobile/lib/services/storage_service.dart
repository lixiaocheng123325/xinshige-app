import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';

class StorageService extends GetxService {
  static StorageService get to => Get.find();
  late final GetStorage _box;

  Future<StorageService> init() async {
    _box = GetStorage();
    return this;
  }

  String? getToken() => _box.read('access_token');
  Future<void> setToken(String token) async => await _box.write('access_token', token);
  Future<void> removeToken() async => await _box.remove('access_token');

  String? getRefreshToken() => _box.read('refresh_token');
  Future<void> setRefreshToken(String token) async => await _box.write('refresh_token', token);
  Future<void> removeRefreshToken() async => await _box.remove('refresh_token');

  Map<String, dynamic>? getUser() {
    final json = _box.read('user_info');
    return json != null ? {'id': json} : null;
  }

  Future<void> setUserInfo(String json) async => await _box.write('user_info', json);
  Future<void> clearAll() async => await _box.erase();
}
