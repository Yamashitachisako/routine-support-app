import { useStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Smile, Meh, Frown, Star } from "lucide-react";
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

export default function History() {
  const { t, language } = useStore();

  const { data: history = [], isLoading } = useQuery({
    queryKey: ['routine-records'],
    queryFn: getRoutineRecords,
  });

  const getDateLocale = () => {
    switch (language) {
      case 'ja': return ja;
      case 'zh': return zhCN;
      default: return enUS;
    }
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
