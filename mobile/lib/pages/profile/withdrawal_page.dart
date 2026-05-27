import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../services/api_service.dart';

class WithdrawalPage extends StatefulWidget {
  const WithdrawalPage({super.key});

  @override
  State<WithdrawalPage> createState() => _WithdrawalPageState();
}

class _WithdrawalPageState extends State<WithdrawalPage> {
  final amountController = TextEditingController();
  final nameController = TextEditingController();
  final accountController = TextEditingController();
  bool isLoading = false;

  Future<void> submit() async {
    final amount = int.tryParse(amountController.text);
    if (amount == null || amount <= 0) {
      Get.snackbar('提示', '请输入正确的金额');
      return;
    }
    setState(() => isLoading = true);
    try {
      await ApiService.to.post('/withdrawals', data: {
        'amount': amount * 100,
        'accountName': nameController.text,
        'accountNumber': accountController.text,
      });
      Get.back();
      Get.snackbar('成功', '提现申请已提交');
    } catch (e) {
      Get.snackbar('错误', '提现失败');
    } finally {
      setState(() => isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('申请提现')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              controller: amountController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: '提现金额（元）',
                prefixIcon: Icon(Icons.attach_money),
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: nameController,
              decoration: const InputDecoration(
                labelText: '收款人姓名',
                prefixIcon: Icon(Icons.person),
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: accountController,
              decoration: const InputDecoration(
                labelText: '收款账号（银行卡/支付宝）',
                prefixIcon: Icon(Icons.account_balance),
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                onPressed: isLoading ? null : submit,
                child: isLoading
                    ? const CircularProgressIndicator()
                    : const Text('提交申请', style: TextStyle(fontSize: 16)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
