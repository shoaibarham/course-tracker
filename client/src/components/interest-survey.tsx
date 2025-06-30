import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Student } from "@shared/schema";

interface InterestSurveyProps {
  student: Student;
}

const INTEREST_OPTIONS = [
  "Machine Learning & AI",
  "Optimization & Operations Research", 
  "Data Science & Analytics",
  "Robotics & Control Systems",
  "Computational Neuroscience"
];

const CAREER_PATHS = [
  "Data Scientist / ML Engineer",
  "Product Manager (Tech)",
  "Consultant",
  "Startup Founder",
  "Research / Graduate Studies",
  "Software Engineering"
];

const LEARNING_STYLES = [
  "Hands-on projects & coding",
  "Theoretical foundations",
  "Mixed approach"
];

export default function InterestSurvey({ student }: InterestSurveyProps) {
  const [interests, setInterests] = useState<string[]>(student.interest_keywords || []);
  const [careerPath, setCareerPath] = useState<string>(student.career_goal || "");
  const [learningStyle, setLearningStyle] = useState<string>(student.term_preference || "");
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateStudentMutation = useMutation({
    mutationFn: async (data: { interest_keywords: string[], career_goal: string, term_preference: string }) => {
      await apiRequest("PUT", `/api/students/${student.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/students/current"] });
      queryClient.invalidateQueries({ queryKey: [`/api/students/${student.id}/recommendations`] });
      toast({
        title: "Profile Updated",
        description: "Your recommendations have been updated based on your preferences.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleInterestChange = (interest: string, checked: boolean) => {
    if (checked) {
      setInterests([...interests, interest]);
    } else {
      setInterests(interests.filter(i => i !== interest));
    }
  };

  const handleSubmit = () => {
    updateStudentMutation.mutate({
      interest_keywords: interests,
      career_goal: careerPath,
      term_preference: learningStyle,
    });
  };

  return (
    <Card className="bg-white mb-8">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Personalize Your Course Recommendations</h2>
        <p className="text-gray-600">Help us recommend courses that align with your interests and career goals.</p>
      </div>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Primary Areas of Interest</Label>
            <div className="space-y-2">
              {INTEREST_OPTIONS.map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={interest}
                    checked={interests.includes(interest)}
                    onCheckedChange={(checked) => handleInterestChange(interest, checked as boolean)}
                  />
                  <Label htmlFor={interest} className="text-sm">
                    {interest}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Career Aspirations</Label>
            <Select value={careerPath} onValueChange={setCareerPath}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your career path..." />
              </SelectTrigger>
              <SelectContent>
                {CAREER_PATHS.map((path) => (
                  <SelectItem key={path} value={path || ""}>
                    {path}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Label className="text-sm font-medium text-gray-700 mt-4 mb-3 block">Preferred Learning Style</Label>
            <RadioGroup value={learningStyle} onValueChange={setLearningStyle}>
              {LEARNING_STYLES.map((style) => (
                <div key={style} className="flex items-center space-x-2">
                  <RadioGroupItem value={style} id={style} />
                  <Label htmlFor={style} className="text-sm">
                    {style}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            
            <Button 
              onClick={handleSubmit}
              disabled={updateStudentMutation.isPending}
              className="mt-4 w-full bg-quest-blue text-white hover:bg-indigo-700"
            >
              {updateStudentMutation.isPending ? "Updating..." : "Update Recommendations"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
