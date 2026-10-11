import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  Building2, 
  Store, 
  CheckCircle2, 
  Lock, 
  AlertCircle,
  Copy,
  Check,
  Smartphone,
  Calendar,
  Clock,
  User,
  ArrowRight
} from 'lucide-react';
import { PaymentMethod, PaymentStatus, SalonService, Stylist, SalonSettings } from '../types';

interface PaymentGatewayProps {
  services: SalonService[];
  stylist: Stylist | null;
  selectedDate: string;
  selectedTimeSlot: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  settings: SalonSettings;
  onPaymentSuccess: (paymentData: {
    method: PaymentMethod;
    status: PaymentStatus;
    totalAmount: number;
    depositPaid: number;
    transactionId: string;
  }) => void;
  onBack: () => void;
}

export const PaymentGateway: React.FC<PaymentGatewayProps> = ({
  services,
  stylist,
  selectedDate,
  selectedTimeSlot,
  clientName,
  clientPhone,
  clientEmail,
  settings,
  onPaymentSuccess,
  onBack,
}) => {
  const totalServiceAmount = services.reduce((acc, s) => acc + s.price, 0);
  const minDeposit = Math.min(settings.minAdvanceDeposit, totalServiceAmount);

  // Payment choice: 'full' | 'deposit' | 'salon'
  const [payChoice, setPayChoice] = useState<'full' | 'deposit' | 'salon'>('deposit');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('upi');

  // UPI state
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [upiTimer, setUpiTimer] = useState(300); // 5 mins

  // Card state
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState(clientName);
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardError, setCardError] = useState('');

  // 3D Secure OTP simulation
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState('789124');
  const [isProcessing, setIsProcessing] = useState(false);

  // Net banking state
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  const amountToCharge = payChoice === 'full' 
    ? totalServiceAmount 
    : payChoice === 'deposit' 
      ? minDeposit 
      : 0;

  // Format Card Number
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
    val = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(val);
  };

  // Format Card Expiry
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setCardExpiry(val);
  };

  // Timer countdown for UPI
  useEffect(() => {
    if (selectedMethod !== 'upi') return;
    const interval = setInterval(() => {
      setUpiTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedMethod]);

  const copyUpiId = () => {
    navigator.clipboard.writeText('therichsalon@upi');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // Trigger payment completion
  const handleCompletePayment = (customMethod?: PaymentMethod, customStatus?: PaymentStatus) => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setShowOtpModal(false);

      const method = customMethod || selectedMethod;
      let status: PaymentStatus = 'paid_deposit';
      let deposit = amountToCharge;

      if (payChoice === 'full') {
        status = 'paid_full';
        deposit = totalServiceAmount;
      } else if (payChoice === 'salon') {
        status = 'pay_at_salon';
        deposit = 0;
      }

      const randomTxn = `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

      onPaymentSuccess({
        method,
        status,
        totalAmount: totalServiceAmount,
        depositPaid: deposit,
        transactionId: randomTxn,
      });
    }, 1200);
  };

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber.replace(/\s/g, '').length < 16) {
      setCardError('Please enter a valid 16-digit card number');
      return;
    }
    if (cardExpiry.length < 5) {
      setCardError('Please enter valid expiry MM/YY');
      return;
    }
    if (cardCvv.length < 3) {
      setCardError('Please enter 3-digit CVV');
      return;
    }
    setCardError('');
    setShowOtpModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Summary Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
            Booking Breakdown
          </div>
          <div className="text-sm font-semibold text-stone-100 mt-0.5">
            {services.map(s => s.name).join(' + ')}
          </div>
          <div className="text-xs text-stone-400 mt-1 flex items-center gap-3">
            <span>Stylist: {stylist?.name || 'Any Senior Stylist'}</span>
            <span>·</span>
            <span>{selectedDate} at {selectedTimeSlot}</span>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <div className="text-xs text-stone-400">Total Service Value</div>
          <div className="text-xl font-bold text-amber-300 font-sans tabular-nums">
            ₹{totalServiceAmount.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Deposit Payment Choice Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block">
          Select Payment Option
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Option 1: Advance Token Deposit */}
          <button
            type="button"
            onClick={() => setPayChoice('deposit')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              payChoice === 'deposit'
                ? 'bg-amber-950/20 border-amber-500/60 ring-1 ring-amber-500/40'
                : 'bg-stone-900/60 border-stone-800 hover:border-stone-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-300">Lock Slot Deposit</span>
              <span className="text-xs font-bold font-mono text-stone-100 tabular-nums">₹{minDeposit}</span>
            </div>
            <p className="text-[11px] text-stone-400 mt-1 leading-snug">
              Pay ₹{minDeposit} online now to guarantee your seat; balance ₹{totalServiceAmount - minDeposit} at salon.
            </p>
          </button>

          {/* Option 2: Full Payment */}
          <button
            type="button"
            onClick={() => setPayChoice('full')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              payChoice === 'full'
                ? 'bg-amber-950/20 border-amber-500/60 ring-1 ring-amber-500/40'
                : 'bg-stone-900/60 border-stone-800 hover:border-stone-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-300">Full Payment</span>
              <span className="text-xs font-bold font-mono text-stone-100 tabular-nums">₹{totalServiceAmount}</span>
            </div>
            <p className="text-[11px] text-stone-400 mt-1 leading-snug">
              Complete full digital payment in advance. Enjoy seamless, zero-wait checkout on salon day.
            </p>
          </button>

          {/* Option 3: Pay at Salon */}
          <button
            type="button"
            onClick={() => {
              setPayChoice('salon');
              setSelectedMethod('pay_at_salon');
            }}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              payChoice === 'salon'
                ? 'bg-amber-950/20 border-amber-500/60 ring-1 ring-amber-500/40'
                : 'bg-stone-900/60 border-stone-800 hover:border-stone-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-300">Pay at Salon</span>
              <span className="text-xs font-bold font-mono text-stone-100">₹0 Now</span>
            </div>
            <p className="text-[11px] text-stone-400 mt-1 leading-snug">
              Reserve slot now with SMS OTP / Mobile verification. Pay entire amount at salon reception.
            </p>
          </button>
        </div>
      </div>

      {/* If Pay at Salon is selected */}
      {payChoice === 'salon' ? (
        <div className="p-5 rounded-xl bg-stone-900 border border-stone-800 space-y-4 text-center">
          <Store className="w-8 h-8 text-amber-400 mx-auto" />
          <div>
            <h4 className="text-sm font-semibold text-stone-100">Pay at Salon Reception</h4>
            <p className="text-xs text-stone-400 mt-1 max-w-md mx-auto">
              Your appointment will be reserved under <strong className="text-stone-200">{clientName}</strong> ({clientPhone}). You can pay ₹{totalServiceAmount.toLocaleString('en-IN')} by Cash, UPI QR, or Card at the salon counter.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => handleCompletePayment('pay_at_salon', 'pay_at_salon')}
              disabled={isProcessing}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold rounded-lg text-sm transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isProcessing ? 'Confirming Appointment...' : 'Confirm Reservation (Pay at Venue)'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Online Payment Methods */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
              Select Gateway Method
            </label>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>256-Bit SSL Encrypted</span>
            </div>
          </div>

          {/* Payment Method Tabs */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSelectedMethod('upi')}
              className={`py-2.5 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
                selectedMethod === 'upi'
                  ? 'bg-stone-800 text-amber-300 border-amber-500/50 font-semibold'
                  : 'bg-stone-900/60 text-stone-400 border-stone-800 hover:text-stone-200'
              }`}
            >
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>UPI / QR</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('card')}
              className={`py-2.5 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
                selectedMethod === 'card'
                  ? 'bg-stone-800 text-amber-300 border-amber-500/50 font-semibold'
                  : 'bg-stone-900/60 text-stone-400 border-stone-800 hover:text-stone-200'
              }`}
            >
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>Cards</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('netbanking')}
              className={`py-2.5 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
                selectedMethod === 'netbanking'
                  ? 'bg-stone-800 text-amber-300 border-amber-500/50 font-semibold'
                  : 'bg-stone-900/60 text-stone-400 border-stone-800 hover:text-stone-200'
              }`}
            >
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Net Banking</span>
            </button>
          </div>

          {/* METHOD 1: UPI */}
          {selectedMethod === 'upi' && (
            <div className="p-5 rounded-xl bg-stone-900/90 border border-stone-800 space-y-5">
              <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
                {/* Simulated High-Res SVG QR Code */}
                <div className="p-3 bg-white rounded-xl shadow-md flex flex-col items-center">
                  <div className="w-40 h-40 bg-white flex items-center justify-center relative">
                    {/* SVG Realistic QR Code graphic */}
                    <svg viewBox="0 0 100 100" className="w-full h-full text-black" fill="currentColor">
                      {/* Corner 1 */}
                      <rect x="5" y="5" width="25" height="25" />
                      <rect x="10" y="10" width="15" height="15" fill="white" />
                      <rect x="14" y="14" width="7" height="7" />
                      {/* Corner 2 */}
                      <rect x="70" y="5" width="25" height="25" />
                      <rect x="75" y="10" width="15" height="15" fill="white" />
                      <rect x="79" y="14" width="7" height="7" />
                      {/* Corner 3 */}
                      <rect x="5" y="70" width="25" height="25" />
                      <rect x="10" y="75" width="15" height="15" fill="white" />
                      <rect x="14" y="79" width="7" height="7" />
                      {/* Pattern Matrix */}
                      <rect x="35" y="10" width="6" height="6" />
                      <rect x="45" y="15" width="8" height="6" />
                      <rect x="58" y="10" width="6" height="12" />
                      <rect x="35" y="24" width="10" height="6" />
                      <rect x="50" y="26" width="6" height="6" />
                      <rect x="10" y="40" width="12" height="6" />
                      <rect x="28" y="38" width="6" height="12" />
                      <rect x="40" y="42" width="18" height="14" />
                      <rect x="68" y="38" width="8" height="6" />
                      <rect x="80" y="44" width="12" height="8" />
                      <rect x="12" y="55" width="8" height="6" />
                      <rect x="38" y="65" width="6" height="12" />
                      <rect x="50" y="60" width="12" height="6" />
                      <rect x="70" y="68" width="8" height="8" />
                      <rect x="82" y="60" width="10" height="15" />
                      <rect x="48" y="75" width="12" height="12" />
                      <rect x="70" y="82" width="18" height="8" />
                    </svg>
                  </div>
                  <div className="text-[10px] text-stone-600 font-mono mt-1 font-semibold">
                    Scan with GPay / PhonePe / Paytm
                  </div>
                </div>

                {/* UPI Instructions and UTR Input */}
                <div className="flex-1 space-y-3 text-left">
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <span>Payable: <strong className="text-amber-300 font-mono text-sm">₹{amountToCharge}</strong></span>
                    <span className="font-mono text-amber-400">
                      Time left: {Math.floor(upiTimer / 60)}:{(upiTimer % 60).toString().padStart(2, '0')}
                    </span>
                  </div>

                  {/* Salon UPI VPA */}
                  <div className="p-2.5 bg-stone-950 rounded-lg border border-stone-800 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-stone-500">Official Salon UPI ID</div>
                      <div className="text-xs font-mono font-medium text-stone-200">therichsalon@upi</div>
                    </div>
                    <button
                      onClick={copyUpiId}
                      className="px-2.5 py-1 text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 rounded flex items-center gap-1 transition-colors"
                    >
                      {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* App quick launch row */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] text-stone-400">Supported Apps:</span>
                    <span className="text-xs text-stone-300 font-medium">Google Pay · PhonePe · Paytm · BHIM</span>
                  </div>

                  {/* Instant Verification Button */}
                  <button
                    onClick={() => handleCompletePayment('upi')}
                    disabled={isProcessing}
                    className="w-full mt-2 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-semibold rounded-lg text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isProcessing ? 'Verifying with NPCI Gateway...' : `I Have Paid ₹${amountToCharge} — Confirm Booking`}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* METHOD 2: Cards */}
          {selectedMethod === 'card' && (
            <form onSubmit={handleCardSubmit} className="p-5 rounded-xl bg-stone-900/90 border border-stone-800 space-y-4">
              {cardError && (
                <div className="p-2.5 bg-rose-950/40 border border-rose-800/60 rounded-lg text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{cardError}</span>
                </div>
              )}

              <div>
                <label className="text-xs text-stone-400 block mb-1">Cardholder Name</label>
                <input
                  type="text"
                  required
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs text-stone-400 block mb-1">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={19}
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="4532 ···· ···· 8921"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-100 font-mono focus:outline-none focus:border-amber-400"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs text-stone-400 font-mono">
                    <span>VISA</span>
                    <span>MC</span>
                    <span>RuPay</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-stone-400 block mb-1">Expiry Date</label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    value={cardExpiry}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-100 font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-400 block mb-1">CVV / CVC</label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                    placeholder="•••"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-100 font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-semibold rounded-lg text-sm transition-all shadow-md flex items-center justify-center gap-2 mt-2"
              >
                <Lock className="w-4 h-4" />
                <span>Pay ₹{amountToCharge} Securely</span>
              </button>
            </form>
          )}

          {/* METHOD 3: Net Banking */}
          {selectedMethod === 'netbanking' && (
            <div className="p-5 rounded-xl bg-stone-900/90 border border-stone-800 space-y-4">
              <div>
                <label className="text-xs text-stone-400 block mb-2">Select Your Bank</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Punjab National'].map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`p-2.5 rounded-lg border text-xs font-medium text-left transition-colors ${
                        selectedBank === bank
                          ? 'bg-amber-950/20 text-amber-300 border-amber-500/60 font-semibold'
                          : 'bg-stone-950 text-stone-300 border-stone-800 hover:border-stone-700'
                      }`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleCompletePayment('netbanking')}
                disabled={isProcessing}
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-semibold rounded-lg text-sm transition-all shadow-md flex items-center justify-center gap-2 mt-2"
              >
                <Building2 className="w-4 h-4" />
                <span>{isProcessing ? 'Redirecting to Bank Portal...' : `Proceed with ${selectedBank} (₹${amountToCharge})`}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Back and navigation */}
      <div className="flex items-center justify-between pt-2 border-t border-stone-800">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-xs text-stone-400 hover:text-white transition-colors"
        >
          ← Back to Details
        </button>
        <div className="text-[11px] text-stone-500 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>Refundable up to 2 hours before scheduled slot</span>
        </div>
      </div>

      {/* 3D Secure Card OTP Modal Simulation */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-stone-200">Verified by Visa / Mastercard</span>
              </div>
              <span className="text-xs font-mono text-amber-300">₹{amountToCharge}</span>
            </div>

            <div className="text-center space-y-1">
              <p className="text-xs text-stone-400">
                A simulated 6-digit authentication OTP was sent to your registered mobile ending in <strong className="text-stone-200">{clientPhone.slice(-4)}</strong>
              </p>
            </div>

            <div>
              <label className="text-xs text-stone-400 block mb-1">One Time Password (OTP)</label>
              <input
                type="text"
                maxLength={6}
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 rounded-lg py-2.5 text-center text-lg font-mono font-bold tracking-widest text-amber-300 focus:outline-none focus:border-amber-400"
              />
              <div className="text-[10px] text-stone-500 text-center mt-1">
                Demo helper: Pre-filled with valid test OTP 789124
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="flex-1 py-2 text-xs text-stone-400 hover:text-white bg-stone-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleCompletePayment('card')}
                disabled={isProcessing}
                className="flex-1 py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
              >
                {isProcessing ? 'Verifying...' : 'Authorize Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
