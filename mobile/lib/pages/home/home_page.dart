import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../controllers/home_controller.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(HomeController());
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('心事盒'),
          bottom: TabBar(
            onTap: controller.onTabChanged,
            tabs: const [
              Tab(text: '广场'),
              Tab(text: '我的'),
            ],
          ),
          actions: [
            IconButton(
              icon: const Icon(Icons.person_outline),
              onPressed: () => Get.toNamed('/profile'),
            ),
          ],
        ),
        body: TabBarView(
          children: [
            _buildNoteList(controller),
            _buildNoteList(controller),
          ],
        ),
        floatingActionButton: FloatingActionButton(
          onPressed: controller.goToCreate,
          child: const Icon(Icons.edit),
        ),
      ),
    );
  }

  Widget _buildNoteList(HomeController controller) {
    return Obx(() {
      if (controller.isLoading.value && controller.notes.isEmpty) {
        return const Center(child: CircularProgressIndicator());
      }
      return RefreshIndicator(
        onRefresh: () => controller.loadNotes(refresh: true),
        child: ListView.builder(
          itemCount: controller.notes.length,
          itemBuilder: (context, index) {
            final note = controller.notes[index];
            return Card(
              margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              child: ListTile(
                title: Text(note['title'] ?? '无标题'),
                subtitle: Text(
                  note['summary'] ?? note['content'] ?? '',
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                trailing: note['visibility'] == 'paid'
                    ? Chip(label: Text('¥${(note['price'] ?? 0) / 100}'))
                    : null,
                onTap: () => controller.goToDetail(note),
              ),
            );
          },
        ),
      );
    });
  }
}
