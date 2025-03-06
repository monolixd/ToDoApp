import { StyleSheet } from "react-native";
import { Collapsible } from "@/components/Collapsible";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function ExploreScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#ffffff" }} // เปลี่ยนจาก "#D0D0D0" เป็น "#ffffff"
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="questionmark.circle"
          style={styles.headerImage}
        />
      }
      style={styles.container} // เพิ่ม style นี้
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText style={styles.titleText} type="title">
          วิธีใช้งาน ToDo App
        </ThemedText>
      </ThemedView>

      <Collapsible title="📝 การเพิ่มรายการใหม่">
        <ThemedText>
          1. พิมพ์รายการที่ต้องทำในช่อง "เพิ่มรายการที่ต้องทำ..."
        </ThemedText>
        <ThemedText>
          2. เลือกระดับความสำคัญ: ต่ำ🟢, ปานกลาง🟡, หรือสูง🔴
        </ThemedText>
        <ThemedText>3. กดปุ่ม "เพิ่มรายการ" เพื่อบันทึก</ThemedText>
      </Collapsible>

      <Collapsible title="✏️ การแก้ไขรายการ">
        <ThemedText>1. กดปุ่ม ✏️ ที่รายการที่ต้องการแก้ไข</ThemedText>
        <ThemedText>2. แก้ไขข้อความหรือระดับความสำคัญตามต้องการ</ThemedText>
        <ThemedText>
          3. กดปุ่ม "บันทึกการแก้ไข" เพื่อบันทึกการเปลี่ยนแปลง
        </ThemedText>
      </Collapsible>

      <Collapsible title="✅ การทำเครื่องหมายว่าเสร็จ">
        <ThemedText>• กดปุ่ม ⬜ เพื่อทำเครื่องหมายว่าเสร็จแล้ว</ThemedText>
        <ThemedText>• เมื่อเสร็จแล้ว จะแสดงเป็น ☑️</ThemedText>
        <ThemedText>• รายการที่เสร็จแล้วจะมีการขีดฆ่าข้อความ</ThemedText>
      </Collapsible>

      <Collapsible title="🗑️ การลบรายการ">
        <ThemedText>• กดปุ่ม 🗑️ เพื่อลบรายการที่ไม่ต้องการ</ThemedText>
        <ThemedText>• ระบบจะแสดงข้อความยืนยันก่อนลบ</ThemedText>
      </Collapsible>

      <Collapsible title="🔄 การจัดเรียงรายการ">
        <ThemedText>สามารถจัดเรียงรายการได้ 4 แบบ:</ThemedText>
        <ThemedText>• เพิ่มล่าสุด - แสดงรายการที่เพิ่มล่าสุดก่อน</ThemedText>
        <ThemedText>• เพิ่มนานสุด - แสดงรายการที่เพิ่มนานที่สุดก่อน</ThemedText>
        <ThemedText>
          • ความสำคัญมากไปน้อย - เรียงจากความสำคัญสูงไปต่ำ
        </ThemedText>
        <ThemedText>
          • ความสำคัญน้อยไปมาก - เรียงจากความสำคัญต่ำไปสูง
        </ThemedText>
      </Collapsible>

      <Collapsible title="ℹ️ รายละเอียดเพิ่มเติม">
        <ThemedText>
          • กดที่ข้อความของรายการเพื่อดูรายละเอียดเพิ่มเติม
        </ThemedText>
        <ThemedText>
          • รายละเอียดจะแสดง: ข้อความเต็ม, วันที่สร้าง, ระดับความสำคัญ และสถานะ
        </ThemedText>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // เพิ่มพื้นหลังสีขาว
  },
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#ffffff', // เพิ่มพื้นหลังสีขาวให้ container
  },
  titleText: {
    fontFamily: 'Kanit-Bold',
    fontSize: 28,
    color: "#2c3e50",
    textAlign: "center",
  },
});
