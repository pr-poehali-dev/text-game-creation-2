import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface Character {
  id: string;
  name: string;
  description: string;
  avatar: string;
}

interface CreateCharacterProps {
  onCreateCharacter: (character: Character) => void;
}

const avatarEmojis = ['🧙', '🧝', '🧛', '🧚', '🦸', '🦹', '👑', '⚔️', '🛡️', '🏹'];

const CreateCharacter = ({ onCreateCharacter }: CreateCharacterProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(avatarEmojis[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !description.trim()) {
      return;
    }

    const newCharacter: Character = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description.trim(),
      avatar: selectedAvatar
    };

    onCreateCharacter(newCharacter);
    setName('');
    setDescription('');
    setSelectedAvatar(avatarEmojis[0]);
  };

  return (
    <Card className="max-w-2xl mx-auto animate-scale-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="UserPlus" size={24} />
          Создать персонажа
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="avatar">Выберите аватар</Label>
            <div className="grid grid-cols-5 gap-3">
              {avatarEmojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedAvatar(emoji)}
                  className={`
                    w-full aspect-square rounded-lg text-3xl flex items-center justify-center
                    transition-all hover:scale-110
                    ${selectedAvatar === emoji 
                      ? 'bg-primary ring-2 ring-primary ring-offset-2 ring-offset-background' 
                      : 'bg-muted hover:bg-muted/70'
                    }
                  `}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Имя персонажа</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите имя..."
              className="text-lg"
              maxLength={30}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Опишите характер, внешность, историю персонажа..."
              className="min-h-[120px] resize-none"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {description.length}/500
            </p>
          </div>

          <Button 
            type="submit" 
            size="lg" 
            className="w-full"
            disabled={!name.trim() || !description.trim()}
          >
            <Icon name="Plus" size={20} className="mr-2" />
            Создать персонажа
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateCharacter;
