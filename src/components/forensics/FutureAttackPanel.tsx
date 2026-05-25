/**
 * FutureAttackPanel
 * Renders future attack probability predictions with explainable rationale.
 */

import { motion } from 'framer-motion';
import { Radar } from 'lucide-react';
import { Card, CardHeader, CardTitle, Badge } from '@/components/ui';
import { cn } from '@/utils/cn';
import type { FutureAttackPrediction } from '@/forensics';

export function FutureAttackPanel({ predictions }: { predictions: FutureAttackPrediction[] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle><Radar className="h-5 w-5 text-cyan-400" />Future Attack Probability</CardTitle>
        <Badge variant="primary" size="sm">{predictions.length} forecasts</Badge>
      </CardHeader>

      {predictions.length === 0 ? (
        <div className="rounded-xl border border-slate-700/40 bg-slate-900/40 p-8 text-center text-sm text-gray-500">
          Forecasts will appear once a cluster reaches predictive confidence.
        </div>
      ) : (
        <div className="space-y-3">
          {predictions.map((prediction, index) => (
            <motion.div
              key={prediction.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(index * 0.03, 0.3) }}
              className="rounded-xl border border-slate-700/40 bg-slate-950/40 p-4"
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{prediction.title}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{prediction.estimatedWindow}</p>
                </div>
                <Badge variant={prediction.probability >= 80 ? 'danger' : prediction.probability >= 65 ? 'warning' : 'secondary'} size="sm">
                  {prediction.probability}%
                </Badge>
              </div>
              <div className="mb-2 h-2 overflow-hidden rounded-full bg-slate-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${prediction.probability}%` }}
                  transition={{ duration: 0.7 }}
                  className={cn(
                    'h-full rounded-full',
                    prediction.probability >= 80 ? 'bg-gradient-to-r from-red-500 to-orange-500' : prediction.probability >= 65 ? 'bg-gradient-to-r from-orange-500 to-amber-400' : 'bg-gradient-to-r from-cyan-500 to-purple-500',
                  )}
                />
              </div>
              <p className="text-[12px] text-white">{prediction.nextLikelyStep}</p>
              <p className="mt-1 text-[11px] text-gray-400">{prediction.rationale}</p>
            </motion.div>
          ))}
        </div>
      )}
    </Card>
  );
}
