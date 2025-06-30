import { Student } from "@shared/schema";

interface HeaderProps {
  student: Student;
}

export default function Header({ student }: HeaderProps) {
  return (
    <header className="bg-uw-black text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <img 
              src="https://images.unsplash.com/photo-1607013251379-e6eecfffe234?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=60" 
              alt="University of Waterloo Logo" 
              className="h-8 w-auto" 
            />
            <div>
              <h1 className="text-lg font-semibold">Management Engineering</h1>
              <p className="text-sm text-gray-300">Course Planning & Recommendations</p>
            </div>
          </div>
          
          <nav className="flex items-center space-x-6">
            <a href="#" className="text-uw-gold hover:text-yellow-300 font-medium">Dashboard</a>
            <a href="#" className="text-white hover:text-uw-gold">Course Catalog</a>
            <a href="#" className="text-white hover:text-uw-gold">Academic Progress</a>
            <a href="#" className="text-white hover:text-uw-gold">Graduation Planner</a>
            
            <div className="flex items-center space-x-3 border-l border-gray-600 pl-6">
              <div className="text-right">
                <span className="text-sm block">{student.name}</span>
                <span className="text-xs text-gray-400">ID: {student.studentId}</span>
              </div>
              <div className="w-8 h-8 bg-uw-gold rounded-full flex items-center justify-center">
                <span className="text-uw-black font-semibold text-sm">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
