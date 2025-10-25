import { CheckCircle2 } from 'lucide-react';
import { Progress } from './ui/progress';

interface RefundProgressProps {
  stage: 'idle' | 'initiated' | 'in-progress' | 'success';
  method: 'wallet' | 'original';
  amount: number;
}

export function RefundProgress({ stage, method, amount }: RefundProgressProps) {
  if (stage === 'idle') return null;

  const stageLabels = {
    initiated: 'Refund Initiated',
    'in-progress': 'Processing Refund',
    success: 'Refund Successful',
  };

  const progressValue = {
    initiated: 33,
    'in-progress': 66,
    success: 100,
  };

  return (
    <div className="bg-[var(--bg-paper)] rounded-[var(--r-12)] p-4 shadow-e-1 space-y-4">
      {stage === 'success' ? (
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-[var(--success)]/10 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-[var(--success)]" />
            </div>
          </div>
          <div>
            <h4 className="font-bold text-[var(--text-primary)]">{stageLabels[stage]}</h4>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              ₹{amount.toFixed(2)} refunded to {method === 'wallet' ? 'your wallet' : 'original payment method'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-[var(--text-primary)]">{stageLabels[stage]}</h4>
            <span className="text-sm text-[var(--text-secondary)] tabular-nums">
              ₹{amount.toFixed(2)}
            </span>
          </div>
          <Progress value={progressValue[stage]} className="h-2" />
          <p className="text-xs text-[var(--text-secondary)]">
            {stage === 'initiated' && 'Your refund request has been received'}
            {stage === 'in-progress' && 'Processing your refund, please wait...'}
          </p>
        </div>
      )}
    </div>
  );
}
