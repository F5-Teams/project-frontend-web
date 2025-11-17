"use client";

import CustomerConsultation from "@/components/chat/CustomerConsultation";

export default function ChatTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Hỗ trợ tư vấn</h1>
            <p className="text-muted-foreground">
              Gửi yêu cầu tư vấn của bạn, đội ngũ staff sẽ hỗ trợ bạn ngay
            </p>
          </div>

          <CustomerConsultation />

          <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <h3 className="font-semibold mb-3">📝 Test Instructions:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>
                Nhập nội dung yêu cầu tư vấn (VD: &quot;Tư vấn về dịch vụ spa
                cho chó&quot;)
              </li>
              <li>Click &quot;Tạo yêu cầu tư vấn&quot;</li>
              <li>Bạn sẽ được chuyển đến trang chat</li>
              <li>
                Chờ staff nhận yêu cầu từ trang{" "}
                <code className="bg-white px-1 py-0.5 rounded">
                  /staff/sessions
                </code>
              </li>
              <li>Khi staff vào, bạn sẽ nhận được thông báo</li>
              <li>Bắt đầu chat với staff</li>
            </ol>
          </div>

          <div className="mt-6 p-6 bg-green-50 dark:bg-green-950 rounded-lg">
            <h3 className="font-semibold mb-3">👨‍💼 Staff Testing:</h3>
            <p className="text-sm mb-3">
              Để test staff flow, mở tab/window khác với tài khoản staff:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>
                Navigate to{" "}
                <code className="bg-white px-1 py-0.5 rounded">
                  /staff/sessions
                </code>
              </li>
              <li>Bạn sẽ thấy session vừa tạo trong danh sách</li>
              <li>Click &quot;Nhận tư vấn&quot;</li>
              <li>Chat với customer</li>
              <li>Kết thúc session khi hoàn tất</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
