import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import CreateCharacter from '@/components/CreateCharacter';
import GameInterface from '@/components/GameInterface';
import Library from '@/components/Library';
import Settings from '@/components/Settings';

interface Character {
  id: string;
  name: string;
  description: string;
  avatar: string;
  imageUrl?: string;
}

interface Story {
  id: string;
  title: string;
  characterId: string;
  messages: Message[];
  createdAt: Date;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  imageUrl?: string;
}

const Index = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [activeTab, setActiveTab] = useState('home');
  const [currentGame, setCurrentGame] = useState<Story | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const { toast } = useToast();

  const handleCreateCharacter = (character: Character) => {
    setCharacters([...characters, character]);
  };

  const handleDeleteCharacter = (id: string) => {
    setCharacters(characters.filter(c => c.id !== id));
    toast({
      title: "Персонаж удалён",
      description: "Персонаж успешно удалён из списка",
    });
  };

  const handleStartGame = (characterId: string) => {
    const character = characters.find(c => c.id === characterId);
    const newStory: Story = {
      id: Date.now().toString(),
      title: `История: ${character?.name || 'Новая игра'}`,
      characterId,
      messages: [],
      createdAt: new Date()
    };
    setStories([...stories, newStory]);
    setCurrentGame(newStory);
    setActiveTab('game');
    
    toast({
      title: "Игра началась!",
      description: `Приключение с ${character?.name} начинается`,
    });
  };

  const generateSceneImage = async (content: string): Promise<string> => {
    const prompt = `Fantasy RPG game scene: ${content.substring(0, 200)}. Cinematic, atmospheric, detailed environment, dramatic lighting, concept art style`;
    
    try {
      const response = await fetch('https://image.pollinations.ai/prompt/' + encodeURIComponent(prompt) + '?width=768&height=512&nologo=true');
      return response.url;
    } catch (error) {
      console.error('Failed to generate scene image:', error);
      return '';
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!currentGame) return;

    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: new Date()
    };

    const updatedGame = {
      ...currentGame,
      messages: [...currentGame.messages, userMessage]
    };

    setCurrentGame(updatedGame);
    setStories(stories.map(s => s.id === updatedGame.id ? updatedGame : s));

    setTimeout(async () => {
      const aiContent = 'Интересный поворот! Ваш персонаж оказывается перед сложным выбором. Перед вами раскинулся туманный лес, полный тайн и опасностей...';
      
      const sceneImage = await generateSceneImage(aiContent);

      const aiResponse: Message = {
        role: 'assistant',
        content: aiContent,
        timestamp: new Date(),
        imageUrl: sceneImage
      };

      const finalGame = {
        ...updatedGame,
        messages: [...updatedGame.messages, aiResponse]
      };

      setCurrentGame(finalGame);
      setStories(stories.map(s => s.id === finalGame.id ? finalGame : s));
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 glass-3d">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-accent shadow-3d">
                  <Icon name="MoreVertical" size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] glass-3d">
                <SheetHeader>
                  <SheetTitle className="text-glow">Меню</SheetTitle>
                  <SheetDescription>Навигация по разделам</SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-2">
                  <Button
                    variant={activeTab === 'home' ? 'default' : 'ghost'}
                    className="w-full justify-start shadow-3d"
                    onClick={() => { setActiveTab('home'); setMenuOpen(false); }}
                  >
                    <Icon name="Home" size={18} className="mr-2" />
                    Главная
                  </Button>
                  <Button
                    variant={activeTab === 'library' ? 'default' : 'ghost'}
                    className="w-full justify-start shadow-3d"
                    onClick={() => { setActiveTab('library'); setMenuOpen(false); }}
                  >
                    <Icon name="Library" size={18} className="mr-2" />
                    Библиотека
                  </Button>
                  <Button
                    variant={activeTab === 'settings' ? 'default' : 'ghost'}
                    className="w-full justify-start shadow-3d"
                    onClick={() => { setActiveTab('settings'); setMenuOpen(false); }}
                  >
                    <Icon name="Settings" size={18} className="mr-2" />
                    Настройки
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-2xl font-bold text-glow">StoryForge AI</h1>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative shadow-3d">
                  <Icon name="Bell" size={20} />
                  {notifications > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                    >
                      {notifications}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 glass-3d">
                <div className="p-4">
                  <h3 className="font-semibold mb-3">Уведомления</h3>
                  {notifications === 0 ? (
                    <p className="text-sm text-muted-foreground">Нет новых уведомлений</p>
                  ) : (
                    <div className="space-y-2">
                      <DropdownMenuItem className="flex items-start gap-3">
                        <Icon name="Sparkles" size={16} className="mt-1 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Новое достижение!</p>
                          <p className="text-xs text-muted-foreground">Вы создали первого персонажа</p>
                        </div>
                      </DropdownMenuItem>
                    </div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="shadow-3d">
                  <Icon name="User" size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-3d">
                <DropdownMenuItem>
                  <Icon name="User" size={16} className="mr-2" />
                  Профиль
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Icon name="Settings" size={16} className="mr-2" />
                  Настройки
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Icon name="LogOut" size={16} className="mr-2" />
                  Выход
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'home' && !currentGame && (
          <div className="animate-fade-in">
            <div className="mb-8 text-center">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-glow">
                Создайте свой мир
              </h2>
              <p className="text-muted-foreground text-lg">
                Интерактивные ролевые приключения с ИИ-персонажами
              </p>
            </div>

            <Tabs defaultValue="characters" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 shadow-3d">
                <TabsTrigger value="characters">Персонажи</TabsTrigger>
                <TabsTrigger value="create">Создать нового</TabsTrigger>
              </TabsList>

              <TabsContent value="characters" className="animate-fade-in">
                {characters.length === 0 ? (
                  <Card className="text-center py-12 glass-3d shadow-3d">
                    <CardContent>
                      <Icon name="Users" size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">У вас пока нет персонажей</p>
                      <p className="text-sm text-muted-foreground mt-2">Создайте своего первого персонажа для начала игры</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {characters.map((character) => (
                      <Card key={character.id} className="cursor-pointer group card-3d shadow-3d glass-3d overflow-hidden">
                        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                          {character.imageUrl ? (
                            <img 
                              src={character.imageUrl} 
                              alt={character.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-6xl">
                              {character.avatar}
                            </div>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCharacter(character.id);
                            }}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                        <CardHeader>
                          <CardTitle className="text-glow">{character.name}</CardTitle>
                          <CardDescription className="line-clamp-2">{character.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button
                            className="w-full shadow-3d-intense"
                            onClick={() => handleStartGame(character.id)}
                          >
                            <Icon name="Play" size={18} className="mr-2" />
                            Начать игру
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="create" className="animate-fade-in">
                <CreateCharacter onCreateCharacter={handleCreateCharacter} />
              </TabsContent>
            </Tabs>
          </div>
        )}

        {activeTab === 'game' && currentGame && (
          <GameInterface
            game={currentGame}
            character={characters.find(c => c.id === currentGame.characterId)}
            onSendMessage={handleSendMessage}
            onBack={() => { setActiveTab('home'); setCurrentGame(null); }}
          />
        )}

        {activeTab === 'library' && (
          <Library stories={stories} characters={characters} />
        )}

        {activeTab === 'settings' && (
          <Settings />
        )}
      </main>
    </div>
  );
};

export default Index;