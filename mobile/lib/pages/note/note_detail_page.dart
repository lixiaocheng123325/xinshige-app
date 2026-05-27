import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../services/api_service.dart';

class NoteDetailPage extends StatefulWidget {
  const NoteDetailPage({super.key});

  @override
  State<NoteDetailPage> createState() => _NoteDetailPageState();
}

class _NoteDetailPageState extends State<NoteDetailPage> {
  dynamic note;
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    loadDetail();
  }

  Future<void> loadDetail() async {
    final args = Get.arguments;
    if (args == null) return;
    try {
      final res = await ApiService.to.get('/notes/${args['id']}');
      setState(() {
        note = res.data['data'];
        isLoading = false;
      });
    } catch (e) {
      setState(() => isLoading = false);
      Get.snackbar('错误', '加载失败');
    }
  }

  Future<void> purchase() async {
    try {
      await ApiService.to.post('/pay/purchase-note', data: {
        'noteId': note['id'],
        'amount': note['price'],
      });
      Get.snackbar('成功', '购买成功');
      loadDetail();
    } catch (e) {
      Get.snackbar('错误', '购买失败，余额不足');
    }
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }
    if (note == null) {
      return const Scaffold(body: Center(child: Text('笔记不存在')));
    }

    final bool isPaid = note['visibility'] == 'paid';
    final bool canViewFull = note['isPurchased'] == true;

    return Scaffold(
      appBar: AppBar(title: Text(note['title'] ?? '笔记详情')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              note['title'] ?? '',
              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                CircleAvatar(child: Text(note['author']?['nickname']?.substring(0, 1) ?? '?')),
                const SizedBox(width: 8),
                Text(note['author']?['nickname'] ?? '匿名'),
              ],
            ),
            const SizedBox(height: 16),
            Expanded(
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (isPaid && !canViewFull) ...[
                      Text(
                        note['summary'] ?? '',
                        style: const TextStyle(fontSize: 16),
                      ),
                      const SizedBox(height: 24),
                      Center(
                        child: ElevatedButton.icon(
                          onPressed: purchase,
                          icon: const Icon(Icons.lock_open),
                          label: Text('解锁查看全文 ¥${(note['price'] ?? 0) / 100}'),
                        ),
                      ),
                    ] else
                      Text(
                        note['content'] ?? '',
                        style: const TextStyle(fontSize: 16, height: 1.6),
                      ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
