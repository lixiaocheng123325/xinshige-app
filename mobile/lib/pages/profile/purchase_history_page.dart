import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../services/api_service.dart';

class PurchaseHistoryPage extends StatefulWidget {
  const PurchaseHistoryPage({super.key});

  @override
  State<PurchaseHistoryPage> createState() => _PurchaseHistoryPageState();
}

class _PurchaseHistoryPageState extends State<PurchaseHistoryPage> {
  List<dynamic> items = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    loadData();
  }

  Future<void> loadData() async {
    try {
      // 实际项目中应调用专门的购买记录接口，这里复用notes列表作为演示
      setState(() => isLoading = false);
    } catch (e) {
      setState(() => isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('购买记录')),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : items.isEmpty
              ? const Center(child: Text('暂无购买记录'))
              : ListView.builder(
                  itemCount: items.length,
                  itemBuilder: (context, index) {
                    return const ListTile(
                      title: Text('笔记标题'),
                      subtitle: Text('购买时间：2024-01-01'),
                      trailing: Text('¥1.00'),
                    );
                  },
                ),
    );
  }
}
