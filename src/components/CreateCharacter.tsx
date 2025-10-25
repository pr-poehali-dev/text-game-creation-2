import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Character {
  id: string;
  name: string;
  description: string;
  avatar: string;
  imageUrl?: string;
}

interface CreateCharacterProps {
  onCreateCharacter: (character: Character) => void;
}

const CreateCharacter = ({ onCreateCharacter }: CreateCharacterProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateCharacterImage = async (name: string, description: string): Promise<string> => {
    const prompt = `Professional fantasy RPG character portrait: ${name}. ${description}. High quality digital art, dramatic lighting, detailed face, cinematic composition, fantasy game character design`;
    
    try {
      const response = await fetch('https://image.pollinations.ai/prompt/' + encodeURIComponent(prompt) + '?width=512&height=512&nologo=true');
      return response.url;
    } catch (error) {
      console.error('Failed to generate image:', error);
      return 'https://placehold.co/512x512/1a1f2c/ea384c?text=' + encodeURIComponent(name[0] || '?');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !description.trim()) {
      return;
    }

    setIsGenerating(true);
    
    toast({
      title: "Генерируем портрет...",
      description: "ИИ создаёт изображение персонажа",
    });

    try {
      const imageUrl = await generateCharacterImage(name.trim(), description.trim());

      const newCharacter: Character = {
        id: Date.now().toString(),
        name: name.trim(),
        description: description.trim(),
        avatar: name[0]?.toUpperCase() || '?',
        imageUrl
      };

      onCreateCharacter(newCharacter);
      
      toast({
        title: "Персонаж создан!",
        description: `${name} готов к приключениям`,
      });

      setName('');
      setDescription('');
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать персонажа",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto animate-scale-in shadow-3d glass-3d">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-glow">
          <Icon name="Sparkles" size={24} />
          Создать персонажа
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Имя персонажа</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите имя..."
              className="text-lg shadow-3d"
              maxLength={30}
              disabled={isGenerating}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание внешности и характера</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Опишите внешность, характер, особенности персонажа для генерации портрета..."
              className="min-h-[120px] resize-none shadow-3d"
              maxLength={500}
              disabled={isGenerating}
            />
            <p className="text-xs text-muted-foreground text-right">
              {description.length}/500
            </p>
          </div>

          <div className="bg-muted/30 rounded-lg p-4 border border-primary/20">
            <div className="flex items-start gap-3">
              <Icon name="Wand2" size={20} className="text-primary mt-1" />
              <div className="text-sm">
                <p className="font-medium mb-1">ИИ-генерация портрета</p>
                <p className="text-muted-foreground">
                  Мы автоматически создадим уникальное изображение персонажа на основе вашего описания
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
                Создаём персонажа...
              </>
            ) : (
              <>
                <Icon name="Plus" size={20} className="mr-2" />
                Создать персонажа
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateCharacter;
