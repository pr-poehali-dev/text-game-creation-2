import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface World {
  id: string;
  name: string;
  description: string;
  genre: string;
  story: string;
  imageUrl?: string;
}

interface WorldCreatorProps {
  onCreateWorld: (world: World) => void;
}

const genres = [
  { id: 'fantasy', name: 'Фэнтези', icon: '🧙', color: 'from-purple-500 to-pink-500' },
  { id: 'scifi', name: 'Научная фантастика', icon: '🚀', color: 'from-blue-500 to-cyan-500' },
  { id: 'horror', name: 'Хоррор', icon: '👻', color: 'from-red-500 to-orange-500' },
  { id: 'mystery', name: 'Детектив', icon: '🔍', color: 'from-yellow-500 to-orange-500' },
  { id: 'romance', name: 'Романтика', icon: '💖', color: 'from-pink-500 to-rose-500' },
  { id: 'adventure', name: 'Приключения', icon: '⚔️', color: 'from-green-500 to-teal-500' },
];

const WorldCreator = ({ onCreateWorld }: WorldCreatorProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(genres[0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateStory = async (worldName: string, worldDesc: string, genre: string): Promise<string> => {
    const genreName = genres.find(g => g.id === genre)?.name || 'фэнтези';
    
    const storyPrompts = [
      `В мире "${worldName}" начинается новая эра. ${worldDesc} Главный герой обнаруживает древний артефакт, который изменит судьбу всего мира...`,
      `Легенды говорят о ${worldName}, где ${worldDesc}. Тёмные силы пробуждаются, и только избранный сможет противостоять надвигающейся угрозе...`,
      `${worldName} — место, где ${worldDesc}. Таинственный странник прибывает в город на закате, неся весть о грядущих переменах...`,
      `В ${worldName}, где ${worldDesc}, происходит нечто невероятное. Пророчество древних начинает сбываться...`
    ];

    return storyPrompts[Math.floor(Math.random() * storyPrompts.length)];
  };

  const generateWorldImage = async (name: string, description: string, genre: string): Promise<string> => {
    const genreName = genres.find(g => g.id === genre)?.name || 'фэнтези';
    const prompt = `Epic ${genreName} world landscape: ${name}. ${description}. Cinematic, atmospheric, detailed environment, dramatic lighting, concept art, high quality digital art`;
    
    try {
      const response = await fetch('https://image.pollinations.ai/prompt/' + encodeURIComponent(prompt) + '?width=1024&height=576&nologo=true');
      return response.url;
    } catch (error) {
      console.error('Failed to generate world image:', error);
      return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !description.trim()) {
      toast({
        title: "Ошибка",
        description: "Заполните название и описание мира",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    toast({
      title: "ИИ создаёт мир...",
      description: "Генерируем историю и изображение",
    });

    try {
      const [story, imageUrl] = await Promise.all([
        generateStory(name.trim(), description.trim(), selectedGenre),
        generateWorldImage(name.trim(), description.trim(), selectedGenre)
      ]);

      const newWorld: World = {
        id: Date.now().toString(),
        name: name.trim(),
        description: description.trim(),
        genre: selectedGenre,
        story,
        imageUrl
      };

      onCreateWorld(newWorld);
      
      toast({
        title: "Мир создан!",
        description: `${name} готов к исследованию`,
      });

      setName('');
      setDescription('');
      setSelectedGenre(genres[0].id);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать мир",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto animate-scale-in shadow-3d glass-3d">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-glow">
          <Icon name="Globe" size={24} />
          Создать мир
        </CardTitle>
        <CardDescription>
          ИИ сгенерирует уникальную историю для вашего мира
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="world-name">Название мира</Label>
            <Input
              id="world-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Эльдория, Нео-Токио, Тёмный лес..."
              className="text-lg shadow-3d"
              maxLength={50}
              disabled={isGenerating}
            />
          </div>

          <div className="space-y-2">
            <Label>Жанр мира</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  type="button"
                  onClick={() => setSelectedGenre(genre.id)}
                  disabled={isGenerating}
                  className={`
                    p-4 rounded-lg text-left transition-all shadow-3d
                    ${selectedGenre === genre.id
                      ? `bg-gradient-to-br ${genre.color} text-white scale-105`
                      : 'bg-muted hover:bg-muted/70'
                    }
                  `}
                >
                  <div className="text-3xl mb-2">{genre.icon}</div>
                  <div className="font-medium text-sm">{genre.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="world-description">Описание мира</Label>
            <Textarea
              id="world-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Опишите атмосферу, ключевые локации, особенности мира..."
              className="min-h-[120px] resize-none shadow-3d"
              maxLength={500}
              disabled={isGenerating}
            />
            <p className="text-xs text-muted-foreground text-right">
              {description.length}/500
            </p>
          </div>

          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg p-4 border border-primary/30">
            <div className="flex items-start gap-3">
              <Icon name="Sparkles" size={20} className="text-primary mt-1" />
              <div className="text-sm">
                <p className="font-medium mb-1">ИИ-генерация истории</p>
                <p className="text-muted-foreground">
                  На основе вашего описания ИИ создаст уникальную историю, изображение мира и начальный сюжет
                </p>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            size="lg" 
            className="w-full shadow-3d-intense"
            disabled={!name.trim() || !description.trim() || isGenerating}
          >
            {isGenerating ? (
              <>
                <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                Создаём мир...
              </>
            ) : (
              <>
                <Icon name="Wand2" size={20} className="mr-2" />
                Создать мир с ИИ
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default WorldCreator;
