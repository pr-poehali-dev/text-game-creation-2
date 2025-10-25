import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Story {
  id: string;
  title: string;
  characterId: string;
  messages: Message[];
  createdAt: Date;
}

interface Character {
  id: string;
  name: string;
  description: string;
  avatar: string;
}

interface LibraryProps {
  stories: Story[];
  characters: Character[];
}

const achievements = [
  { id: 1, name: 'Первые шаги', description: 'Создайте первого персонажа', icon: '🎯', unlocked: true },
  { id: 2, name: 'Рассказчик', description: 'Отправьте 100 сообщений', icon: '📖', unlocked: false },
  { id: 3, name: 'Создатель миров', description: 'Создайте 5 персонажей', icon: '🌍', unlocked: false },
  { id: 4, name: 'Мастер историй', description: 'Завершите 10 историй', icon: '⭐', unlocked: false },
];

const Library = ({ stories, characters }: LibraryProps) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold mb-6">Библиотека</h2>

      <Tabs defaultValue="stories" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="stories">Истории</TabsTrigger>
          <TabsTrigger value="achievements">Достижения</TabsTrigger>
        </TabsList>

        <TabsContent value="stories" className="animate-fade-in">
          {stories.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Icon name="BookOpen" size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">У вас пока нет сохранённых историй</p>
                <p className="text-sm text-muted-foreground mt-2">Начните игру, чтобы создать первую историю</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stories.map((story) => {
                const character = characters.find(c => c.id === story.characterId);
                return (
                  <Card key={story.id} className="hover:bg-accent/50 transition-colors cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {character && (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xl">
                              {character.avatar}
                            </div>
                          )}
                          <div>
                            <CardTitle className="text-lg">{story.title}</CardTitle>
                            <CardDescription>
                              {character?.name || 'Неизвестный персонаж'}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Icon name="MessageSquare" size={16} />
                          <span>{story.messages.length} сообщений</span>
                        </div>
                        <span>
                          {story.createdAt.toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="achievements" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={`${achievement.unlocked ? 'bg-card' : 'bg-muted/50 opacity-60'}`}
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <CardTitle className="text-lg">{achievement.name}</CardTitle>
                        {achievement.unlocked && (
                          <Badge variant="default" className="bg-primary">
                            <Icon name="Check" size={14} className="mr-1" />
                            Получено
                          </Badge>
                        )}
                      </div>
                      <CardDescription>{achievement.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Library;
