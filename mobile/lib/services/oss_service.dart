import 'package:dio/dio.dart';
import 'dart:io';

class OssService {
  static Future<String?> uploadFile(File file, String fileName) async {
    // TODO: 接入阿里云 OSS
    // 开发阶段返回模拟 URL
    await Future.delayed(const Duration(seconds: 1));
    return 'https://example.com/mock/$fileName';
  }
}
