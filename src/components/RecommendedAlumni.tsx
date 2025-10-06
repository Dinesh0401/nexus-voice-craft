import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, MapPin, ChevronRight } from 'lucide-react';
import { Alumni, getRecommendedAlumni } from '@/data/alumni';
import { getCurrentStudent } from '@/data/students';
import { useToast } from '@/hooks/use-toast';
import { useConnections } from '@/hooks/useConnections';
const RecommendedAlumni = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { sendConnectionRequest } = useConnections();
  const currentStudent = getCurrentStudent();
  const recommendedAlumni = getRecommendedAlumni(currentStudent, 3);
  
  const viewAlumniDirectory = () => {
    navigate('/alumni');
  };
  
  const handleContactClick = async (alumniId: string, alumniName: string) => {
    await sendConnectionRequest(alumniId);
    toast({
      title: "Connection request sent!",
      description: `Your connection request has been sent to ${alumniName}.`
    });
  };
  if (recommendedAlumni.length === 0) {
    return null;
  }
  return <div className="mt-10 mb-16 mx-[36px] my-[35px] px-[58px] py-[12px] bg-zinc-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Personalized Connections</h2>
          <p className="text-gray-600">Alumni who align with your aspirations</p>
        </div>
        <Button variant="outline" onClick={viewAlumniDirectory} className="flex items-center gap-1">
          View all
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendedAlumni.map(alumni => <Card key={alumni.id} className="overflow-hidden hover:shadow-md transition-all mx-0 my-[6px] px-[6px] py-0">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <img src={alumni.avatar} alt={alumni.name} className="w-14 h-14 rounded-full object-cover" />
                <div>
                  <h3 className="font-semibold">{alumni.name}</h3>
                  <div className="text-sm text-gray-600 flex items-center">
                    <Briefcase className="h-3.5 w-3.5 mr-1" />
                    {alumni.role} at {alumni.company}
                  </div>
                  <div className="text-sm text-gray-600 flex items-center mt-1">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    {alumni.location}
                  </div>
                </div>
              </div>
              
              <div className="mt-3">
                <p className="text-sm text-gray-700 line-clamp-2">{alumni.bio}</p>
              </div>
              
              {alumni.expertiseTags && <div className="mt-3 flex flex-wrap gap-1">
                  {alumni.expertiseTags.slice(0, 2).map((tag, index) => <span key={index} className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                      {tag}
                    </span>)}
                  {alumni.expertiseTags.length > 2 && <span className="inline-block text-gray-500 text-xs px-1">
                      +{alumni.expertiseTags.length - 2} more
                    </span>}
                </div>}
            </CardContent>
            
            <CardFooter className="bg-gray-50 p-4">
              <Button 
                onClick={() => handleContactClick(alumni.id, alumni.name)} 
                className="w-full bg-nexus-primary hover:bg-nexus-primary/90 mx-[9px] px-[22px] py-[11px] my-0"
              >
                Connect Now
              </Button>
            </CardFooter>
          </Card>)}
      </div>
    </div>;
};
export default RecommendedAlumni;