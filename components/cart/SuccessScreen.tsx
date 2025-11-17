"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  Clock,
  Mail,
  Calendar,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";

interface SuccessScreenProps {
  bookingId: string;
  totalPrice: number;
  depositAmount: number;
  onContinueShopping: () => void;
  onViewBooking?: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({
  bookingId,
  totalPrice,
  depositAmount,
  onContinueShopping,
  onViewBooking,
}) => {
  const estimatedConfirmationTime = new Date(Date.now() + 3 * 60 * 60 * 1000); // 3 hours from now

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Request Submitted!
          </h1>
          <p className="text-gray-600">
            Your booking request has been received and is being processed.
          </p>
        </div>

        {/* Booking Details Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Booking Details</span>
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                Pending Confirmation
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Booking ID</p>
                    <p className="font-medium">{bookingId}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Submitted</p>
                    <p className="font-medium">
                      {format(new Date(), "MMM dd, yyyy HH:mm")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Deposit Paid</p>
                    <p className="font-medium text-green-600">
                      ${depositAmount}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="font-medium">${totalPrice}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Confirmation Timeline */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">What Happens Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="font-medium">Confirmation Email</h4>
                  <p className="text-sm text-gray-600">
                    You&apos;ll receive a confirmation email within 3 hours with
                    all the details.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="font-medium">Availability Check</h4>
                  <p className="text-sm text-gray-600">
                    We&apos;ll verify availability for your selected services
                    and time slots.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="font-medium">Final Confirmation</h4>
                  <p className="text-sm text-gray-600">
                    Once confirmed, you&apos;ll receive final details and any
                    necessary instructions.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Information */}
        <Alert className="mb-6">
          <Mail className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">Important:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Please check your email regularly for updates</li>
                <li>
                  If you don't receive confirmation within 3 hours, please
                  contact us
                </li>
                <li>All bookings are subject to availability confirmation</li>
                <li>
                  You can cancel or modify your booking up to 24 hours before
                  the scheduled time
                </li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>

        {/* Estimated Confirmation Time */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-600">
                  Expected Confirmation Time
                </span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {format(estimatedConfirmationTime, "MMM dd, yyyy HH:mm")}
              </p>
              <p className="text-sm text-gray-500">
                (Approximately 3 hours from now)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={onContinueShopping}
            variant="outline"
            className="flex-1"
          >
            Continue Shopping
          </Button>
          {onViewBooking && (
            <Button onClick={onViewBooking} className="flex-1">
              View Booking Details
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Contact Information */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            Need help? Contact us at{" "}
            <span className="text-blue-600">support@happypaws.com</span> or call{" "}
            <span className="text-blue-600">(555) 123-4567</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessScreen;
