import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import CreateCharacter from '@/components/CreateCharacter';
import GameInterface from '@/components/GameInterface';
import Library from '@/components/Library';
import Settings from '@/components/Settings';

interface Character {
  id: string;
  name: string;
  description: string;
  avatar: string;
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
}

const Index = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [activeTab, setActiveTab] = useState('home');
  const [currentGame, setCurrentGame] = useState<Story | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleCreateCharacter = (character: Character) => {
    setCharacters([...characters, character]);
  };

  const handleDeleteCharacter = (id: string) => {
    setCharacters(characters.filter(c => c.id !== id));
  };

  const handleStartGame = (characterId: string) => {
    const newStory: Story = {
      id: Date.now().toString(),
      title: 'Новая история',
      characterId,
      messages: [],
      createdAt: new Date()
    };
    setStories([...stories, newStory]);
    setCurrentGame(newStory);
    setActiveTab('game');
  };

  const handleSendMessage = (content: string) => {
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

    setTimeout(() => {
      const aiResponse: Message = {
        role: 'assistant',
        content: 'Интересный поворот! Ваш персонаж оказывается перед сложным выбором...',
        timestamp: new Date()
      };

      const finalGame = {
        ...updatedGame,
        messages: [...updatedGame.messages, aiResponse]
      };

      setCurrentGame(finalGame);
      setStories(stories.map(s => s.id === finalGame.id ? finalGame : s));
    }, 1000);

    setCurrentGame(updatedGame);
    setStories(stories.map(s => s.id === updatedGame.id ? updatedGame : s));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-accent">
                  <Icon name="MoreVertical" size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Меню</SheetTitle>
                  <SheetDescription>Навигация по разделам</SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-2">
                  <Button
                    variant={activeTab === 'home' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => { setActiveTab('home'); setMenuOpen(false); }}
                  >
                    <Icon name="Home" size={18} className="mr-2" />
                    Главная
                  </Button>
                  <Button
                    variant={activeTab === 'library' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => { setActiveTab('library'); setMenuOpen(false); }}
                  >
                    <Icon name="Library" size={18} className="mr-2" />
                    Библиотека
                  </Button>
                  <Button
                    variant={activeTab === 'settings' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => { setActiveTab('settings'); setMenuOpen(false); }}
                  >
                    <Icon name="Settings" size={18} className="mr-2" />
                    Настройки
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-2xl font-bold">StoryForge AI</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Icon name="Bell" size={20} />
            </Button>
            <Button variant="ghost" size="icon">
              <Icon name="User" size={20} />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'home' && !currentGame && (
          <div className="animate-fade-in">
            <div className="mb-8 text-center">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Создайте свой мир
              </h2>
              <p className="text-muted-foreground text-lg">
                Интерактивные ролевые приключения с ИИ-персонажами
              </p>
            </div>

            <Tabs defaultValue="characters" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="characters">Персонажи</TabsTrigger>
                <TabsTrigger value="create">Создать нового</TabsTrigger>
              </TabsList>

              <TabsContent value="characters" className="animate-fade-in">
                {characters.length === 0 ? (
                  <Card className="text-center py-12">
                    <CardContent>
                      <Icon name="Users" size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">У вас пока нет персонажей</p>
                      <p className="text-sm text-muted-foreground mt-2">Создайте своего первого персонажа для начала игры</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {characters.map((character) => (
                      <Card key={character.id} className="hover:scale-105 transition-transform cursor-pointer group">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl mb-3">
                              {character.avatar}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCharacter(character.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Icon name="Trash2" size={16} />
                            </Button>
                          </div>
                          <CardTitle>{character.name}</CardTitle>
                          <CardDescription>{character.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button
                            className="w-full"
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
