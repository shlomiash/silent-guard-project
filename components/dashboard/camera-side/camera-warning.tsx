'use client'

import { AlertTriangle, X } from 'lucide-react'
import Link from 'next/link'

interface CameraWarningProps {
  cameraName: string
  categoryId: string
  onDismiss?: () => void
}

export default function CameraWarning({ cameraName, categoryId, onDismiss }: CameraWarningProps) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-yellow-200 border-l-4 border-yellow-600 text-yellow-900 p-4 rounded shadow-lg w-[90%] max-w-md animate-pulse">
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-6 h-6" />
        <div className="flex-1">
          <p className="font-bold">Potential Drowning Detected</p>
          <p>
            Camera <span className="font-semibold">{cameraName}</span> triggered an alert
            in another category.{' '}
            <Link
              href={`/dashboard/categories/${categoryId}`}
              className="underline font-medium text-blue-800"
            >
              View Category
            </Link>
          </p>
        </div>
        {onDismiss && (
          <button 
            onClick={onDismiss} 
            className="text-yellow-900 hover:text-yellow-700 transition-colors"
            aria-label="Dismiss warning"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  )
}
