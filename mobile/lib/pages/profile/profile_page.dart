import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../services/api_service.dart';
import '../../services/storage_service.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  dynamic user;
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    loadUser();
  }

  Future<void> loadUser() async {
    try {
      final res = await ApiService.to.get('/user/profile');
      setState(() {
        user = res.data['data'];
        isLoading = false;
      });
    } catch (e) {
      setState(() => isLoading = false);
    }
  }

  void logout() {
    StorageService.to.clearAll();
    Get.offAllNamed('/login');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('个人中心')),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView(
              children: [
                ListTile(
                  leading: CircleAvatar(
                    radius: 28,
                    backgroundImage: user?['avatar'] != null ? NetworkImage(user!['avatar']) : null,
                    child: user?['avatar'] == null ? Text(user?['nickname']?.substring(0, 1) ?? '?') : null,
                  ),
                  title: Text(user?['nickname'] ?? '用户'),
                  subtitle: Text(user?['phone'] ?? ''),
                ),
                const Divider(),
                ListTile(
                  leading: const Icon(Icons.account_balance_wallet),
                  title: const Text('我的余额'),
                  trailing: Text(
                    '¥${((user?['balance'] ?? 0) / 100).toStringAsFixed(2)}',
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.orange),
                  ),
                ),
                ListTile(
                  leading: const Icon(Icons.history),
                  title: const Text('购买记录'),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () => Get.toNamed('/purchase-history'),
                ),
                ListTile(
                  leading: const Icon(Icons.currency_exchange),
                  title: const Text('提现'),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () => Get.toNamed('/withdrawal'),
                ),
                const Divider(),
                ListTile(
                  leading: const Icon(Icons.logout, color: Colors.red),
                  title: const Text('退出登录', style: TextStyle(color: Colors.red)),
                  onTap: logout,
                ),
              ],
            ),
    );
  }
}
