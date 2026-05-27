import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../services/api_service.dart';

class NoteEditPage extends StatefulWidget {
  const NoteEditPage({super.key});

  @override
  State<NoteEditPage> createState() => _NoteEditPageState();
}

class _NoteEditPageState extends State<NoteEditPage> {
  final titleController = TextEditingController();
  final contentController = TextEditingController();
  final priceController = TextEditingController();
  String visibility = 'public';
  bool isLoading = false;

  Future<void> submit() async {
    if (titleController.text.isEmpty || contentController.text.isEmpty) {
      Get.snackbar('提示', '请填写标题和内容');
      return;
    }
    setState(() => isLoading = true);
    try {
      await ApiService.to.post('/notes', data: {
        'title': titleController.text,
        'content': contentController.text,
        'visibility': visibility,
        'price': visibility == 'paid' ? int.parse(priceController.text) * 100 : 0,
      });
      Get.back(result: true);
      Get.snackbar('成功', '发布成功');
    } catch (e) {
      Get.snackbar('错误', '发布失败');
    } finally {
      setState(() => isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('发布笔记')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              controller: titleController,
              decoration: const InputDecoration(labelText: '标题', border: OutlineInputBorder()),
            ),
            const SizedBox(height: 12),
            Expanded(
              child: TextField(
                controller: contentController,
                maxLines: null,
                expands: true,
                textAlignVertical: TextAlignVertical.top,
                decoration: const InputDecoration(
                  labelText: '内容',
                  border: OutlineInputBorder(),
                  alignLabelWithHint: true,
                ),
              ),
            ),
            const SizedBox(height: 12),
            SegmentedButton<String>(
              segments: const [
                ButtonSegment(value: 'private', label: Text('私密')),
                ButtonSegment(value: 'public', label: Text('公开')),
                ButtonSegment(value: 'paid', label: Text('付费')),
              ],
              selected: {visibility},
              onSelectionChanged: (set) => setState(() => visibility = set.first),
            ),
            if (visibility == 'paid') ...[
              const SizedBox(height: 12),
              TextField(
                controller: priceController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(
                  labelText: '价格（元）',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.attach_money),
                ),
              ),
            ],
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                onPressed: isLoading ? null : submit,
                child: isLoading
                    ? const CircularProgressIndicator()
                    : const Text('发布', style: TextStyle(fontSize: 16)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
