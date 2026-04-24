import { useStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Smile, Meh, Frown, Star, Sun, Eye, Activity } from "lucide-react";
import { format } from "date-fns";
import { ja, enUS, zhCN } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { getRoutineRecords } from "@/lib/api";

const MoodIcon = ({ feeling }: { feeling: string }) => {
  switch (feeling) {
    case 'veryBad': return <Frown className="h-5 w-5 text-red-400" />;
    case 'bad': return <Meh className="h-5 w-5 text-orange-400" />;
    case 'neutral': return <Meh className="h-5 w-5 text-yellow-400" />;
    case 'good': return <Smile className="h-5 w-5 text-green-400" />;
    case 'veryGood': return <Star className="h-5 w-5 text-primary" />;
    default: return <Smile className="h-5 w-5 text-muted-foreground" />;
  }
};

const RoutineTypeIcon = ({ type }: { type: string }) => {
  if (type === 'eyeExercise') return <Eye className="h-4 w-4 text-indigo-400" />;
  if (type === 'stretching') return <Activity className="h-4 w-4 text-green-400" />;
  return <Sun className="h-4 w-4 text-amber-400" />;
};

export default function History() {
  const { t, language } = useStore();

  const { data: history = [], isLoading } = useQuery({
    queryKey: ['routine-records'],
    queryFn: getRoutineRecords,
  });

  const getDateLocale = () => {
    switch (language) {
      case 'ja':
        return ja;
      case 'zh':
        return zhCN;
      default:
        return enUS;
    }
  };

  const getRoutineTypeLabel = (type: string) => {
    if (type === 'eyeExercise') return t.eyeExercise;
    if (type === 'stretching') return t.stretchingExercise;
    if (type === 'morning') return t.wipeDownRoutine;
    return type;
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
        <p className="text-lg">{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-6">
      <h2 className="text-2xl font-heading font-bold text-foreground">{t.history}</h2>
      
      {history.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
          <p className="text-lg">{t.noHistory}</p>
        </div>
      ) : (
        <ScrollArea className="flex-1 -mr-4 pr-4">
          <div className="space-y-4 pb-4">
            {history.map((record) => (
              <Card key={record.id} className="bg-white/60 border-none shadow-sm hover:bg-white/80 transition-colors">
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="p-3 bg-white rounded-full shadow-sm">
                    <MoodIcon feeling={record.feeling} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline mb-1">
                      <div>
                        <h4 className="font-medium text-foreground">{record.userName}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <RoutineTypeIcon type={record.routineType || 'morning'} />
                          <span className="text-xs text-muted-foreground">
                            {getRoutineTypeLabel(record.routineType || 'morning')}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(record.date), 'PPP p', { locale: getDateLocale() })}
                        </span>
                      </div>
                    </div>
                    {record.comment && (
                      <p className="text-sm text-muted-foreground mt-2 bg-white/50 p-2 rounded-lg inline-block">
                        "{record.comment}"
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
