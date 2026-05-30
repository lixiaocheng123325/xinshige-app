import 'package:get/get.dart';
import 'package:dio/dio.dart' as dio;
import 'storage_service.dart';

class ApiService extends GetxService {
  static ApiService get to => Get.find();
  late final dio.Dio _dio;

  @override
  void onInit() {
    super.onInit();
    _dio = dio.Dio(dio.BaseOptions(
      baseUrl: 'http://localhost:3000/api',
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 15),
      headers: {'Content-Type': 'application/json'},
    ));

    _dio.interceptors.add(dio.InterceptorsWrapper(
      onRequest: (options, handler) {
        final token = StorageService.to.getToken();
        print('>>> API Request: ${options.method} ${options.path}, token=${token != null ? 'present(${token.substring(0, token.length > 8 ? 8 : token.length)}...)' : 'null'}');
        if (token != null && token.isNotEmpty) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        handler.next(options);
      },
      onError: (error, handler) {
        print('>>> API Error: status=${error.response?.statusCode}, msg=${error.message}, path=${error.requestOptions.path}');
        if (error.response?.statusCode == 401) {
          print('>>> 401 detected, navigating to /login');
          StorageService.to.removeToken();
          Get.offAllNamed('/login');
        }
        handler.next(error);
      },
    ));
  }

  Future<dio.Response> get(String path, {Map<String, dynamic>? query}) async {
    return _dio.get(path, queryParameters: query);
  }

  Future<dio.Response> post(String path, {dynamic data}) async {
    return _dio.post(path, data: data);
  }

  Future<dio.Response> put(String path, {dynamic data}) async {
    return _dio.put(path, data: data);
  }

  Future<dio.Response> delete(String path) async {
    return _dio.delete(path);
  }
}
