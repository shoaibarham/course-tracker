import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { Student } from "@shared/schema";

interface AcademicProgressProps {
  student: Student;
}

export default function AcademicProgress({ student }: AcademicProgressProps) {
  // Calculate overall progress based on term
  const calculateProgress = (term: string): number => {
    if (term.includes("3B")) return 68;
    if (term.includes("3A")) return 60;
    if (term.includes("2B")) return 45;
    if (term.includes("2A")) return 30;
    if (term.includes("1B")) return 15;
    return 0;
  };

  const overallProgress = calculateProgress(student.currentTerm);

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Academic Progress</h3>
          <GraduationCap className="h-5 w-5 text-quest-blue" />
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Overall Progress</span>
              <span>{overallProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-quest-blue h-2 rounded-full transition-all duration-300" 
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Current Term</p>
              <p className="font-semibold">{student.currentTerm}</p>
            </div>
            <div>
              <p className="text-gray-600">CGPA</p>
              <p className="font-semibold">{student.cgpa.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
