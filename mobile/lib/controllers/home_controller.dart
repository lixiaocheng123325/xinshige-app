import 'package:get/get.dart';
import '../services/api_service.dart';

class HomeController extends GetxController {
  final notes = <dynamic>[].obs;
  final myNotes = <dynamic>[].obs;
  final isLoading = false.obs;
  final currentTab = 0.obs;
  int page = 1;
  final limit = 20;

  @override
  void onInit() {
    super.onInit();
    loadNotes();
  }

  Future<void> loadNotes({bool refresh = false}) async {
    if (refresh) page = 1;
    try {
      isLoading.value = true;
      final res = await ApiService.to.get('/notes', query: {
        'page': page.toString(),
        'limit': limit.toString(),
        if (currentTab.value == 1) 'mine': '1',
      });
      final items = res.data['data']?['items'] ?? [];
      if (refresh) {
        notes.assignAll(items);
      } else {
        notes.addAll(items);
      }
    } catch (e) {
      print('Load notes error: $e');
    } finally {
      isLoading.value = false;
    }
  }

  void onTabChanged(int index) {
    currentTab.value = index;
    loadNotes(refresh: true);
  }

  void goToDetail(dynamic note) {
    Get.toNamed('/note/detail', arguments: note);
  }

  void goToCreate() {
    Get.toNamed('/note/edit');
  }
}
