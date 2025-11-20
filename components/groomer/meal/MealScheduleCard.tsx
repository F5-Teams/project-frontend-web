import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { FeedingSchedule } from "@/services/groomer/meal/type";

interface MealScheduleCardProps {
  schedule: FeedingSchedule;
  onMarkAsFed: (scheduleId: number, quantity: string, notes?: string) => void;
  isMarking: boolean;
}

export function MealScheduleCard({
  schedule,
  onMarkAsFed,
  isMarking,
}: MealScheduleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");

  const getMealTypeLabel = (mealType: string) => {
    const labels = {
      BREAKFAST: "Bữa sáng",
      LUNCH: "Bữa trưa",
      DINNER: "Bữa tối",
    };
    return labels[mealType as keyof typeof labels] || mealType;
  };

  const handleSubmit = () => {
    if (!quantity.trim()) {
      return;
    }
    onMarkAsFed(schedule.id, quantity, notes || undefined);
    setIsExpanded(false);
    setQuantity("");
    setNotes("");
  };

  const handleCancel = () => {
    setIsExpanded(false);
    setQuantity("");
    setNotes("");
  };

  const getMealBorderColor = (mealType: string) => {
    const colors = {
      BREAKFAST: "border-l-orange-400",
      LUNCH: "border-l-blue-400",
      DINNER: "border-l-purple-400",
    };
    return colors[mealType as keyof typeof colors] || "border-l-gray-400";
  };

  return (
    <Card className={`border-l-4 ${getMealBorderColor(schedule.mealType)}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Clock
                className={`w-4 h-4 ${
                  schedule.mealType === "BREAKFAST"
                    ? "text-orange-500"
                    : schedule.mealType === "LUNCH"
                    ? "text-blue-500"
                    : "text-purple-500"
                }`}
              />
              <h4 className="font-poppins-regular">
                {getMealTypeLabel(schedule.mealType)}
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <span className="text-gray-500">Thức ăn:</span>
                <span className="ml-2 font-poppins-regular">
                  {schedule.foodItem.name}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Loại:</span>
                <span className="ml-2 font-medium">
                  {schedule.foodItem.category.replace("_", " ")}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Trạng thái:</span>
                <span
                  className={`ml-2 font-poppins-medium ${
                    schedule.status === "PENDING"
                      ? "text-orange-600"
                      : schedule.status === "FED"
                      ? "text-green-600"
                      : "text-gray-600"
                  }`}
                >
                  {schedule.status === "PENDING"
                    ? "Chưa cho ăn"
                    : schedule.status === "FED"
                    ? "Đã cho ăn"
                    : "Đã bỏ qua"}
                </span>
              </div>
              {schedule.foodItem.description && (
                <div className="col-span-2">
                  <span className="text-gray-500">Mô tả:</span>
                  <span className="ml-2 text-gray-600">
                    {schedule.foodItem.description}
                  </span>
                </div>
              )}
              {schedule.notes && (
                <div className="col-span-2">
                  <span className="text-gray-500">Ghi chú:</span>
                  <span className="ml-2 font-medium">{schedule.notes}</span>
                </div>
              )}
            </div>

            {isExpanded && (
              <div className=" pt-4 border-t space-y-3">
                <div>
                  <label className="block text-sm font-poppins-regular mb-1">
                    Khối lượng thực tế *
                  </label>
                  <Input
                    placeholder="Ví dụ: 200g, 1 chén"
                    value={quantity}
                    className="font-poppins-light"
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-poppins-regular mb-1">
                    Ghi chú thêm
                  </label>
                  <Textarea
                    placeholder="Ghi chú về tình trạng ăn uống của thú cưng..."
                    value={notes}
                    className="font-poppins-light"
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {schedule.status === "PENDING" ? (
              isExpanded ? (
                <>
                  <Button
                    onClick={handleSubmit}
                    disabled={isMarking || !quantity.trim()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Xác nhận
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    Hủy
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsExpanded(true)}
                  className="bg-primary font-poppins-light hover:bg-primary/90"
                >
                  Đã cho ăn
                </Button>
              )
            ) : (
              <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-center text-sm font-medium">
                ✓ Đã hoàn thành
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
