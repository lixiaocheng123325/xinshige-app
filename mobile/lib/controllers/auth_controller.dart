import 'package:get/get.dart';
import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../services/storage_service.dart';

class AuthController extends GetxController {
  final phoneController = TextEditingController();
  final codeController = TextEditingController();
  final isLoading = false.obs;
  final countdown = 0.obs;

  Future<void> sendSms() async {
    if (phoneController.text.length != 11) {
      Get.snackbar('提示', '请输入正确的手机号');
      return;
    }
    try {
      isLoading.value = true;
      await ApiService.to.post('/auth/send-sms', data: {'phone': phoneController.text});
      Get.snackbar('成功', '验证码已发送');
      countdown.value = 60;
      _startCountdown();
    } catch (e) {
      Get.snackbar('错误', '发送失败: $e');
    } finally {
      isLoading.value = false;
    }
  }

  void _startCountdown() {
    Future.doWhile(() async {
      await Future.delayed(const Duration(seconds: 1));
      countdown.value--;
      return countdown.value > 0;
    });
  }

  Future<void> login() async {
    if (phoneController.text.isEmpty || codeController.text.isEmpty) {
      Get.snackbar('提示', '请填写完整信息');
      return;
    }
    try {
      isLoading.value = true;
      final res = await ApiService.to.post('/auth/login-phone', data: {
        'phone': phoneController.text,
        'code': codeController.text,
      });
      final responseData = res.data['data'];
      if (responseData == null || responseData['accessToken'] == null) {
        Get.snackbar('错误', '登录响应数据异常');
        return;
      }
      await StorageService.to.setToken(responseData['accessToken']);
      await StorageService.to.setRefreshToken(responseData['refreshToken']);
      await StorageService.to.setUserInfo(responseData['user'].toString());
      Get.offAllNamed('/home');
    } catch (e) {
      Get.snackbar('错误', '登录失败: $e');
    } finally {
      isLoading.value = false;
    }
  }
}
