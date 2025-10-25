import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
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

interface GameInterfaceProps {
  game: Story;
  character?: Character;
  onSendMessage: (content: string) => void;
  onBack: () => void;
}

const GameInterface = ({ game, character, onSendMessage, onBack }: GameInterfaceProps) => {
  const [message, setMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [game.messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    onSendMessage(message.trim());
    setMessage('');
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          Назад
        </Button>
        <div className="flex items-center gap-3">
          {character && (
            <>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                {character.avatar}
              </div>
              <div>
                <h3 className="font-semibold">{character.name}</h3>
                <Badge variant="secondary" className="text-xs">ИИ Мастер активен</Badge>
              </div>
            </>
          )}
        </div>
      </div>

      <Card className="flex flex-col h-[70vh]">
        <ScrollArea className="flex-1 p-6" ref={scrollRef}>
          {game.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <Icon name="Sparkles" size={40} className="text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Начните свою историю</h3>
                <p className="text-muted-foreground max-w-md">
                  ИИ-мастер поможет создать увлекательный сюжет. Опишите желаемый сценарий или задайте вопрос.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center max-w-2xl">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMessage('Расскажи о мире, в котором мы играем')}
                >
                  О мире
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMessage('Начни с загадочного события')}
                >
                  Загадка
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMessage('Создай эпическое приключение')}
                >
                  Приключение
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {game.messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div
                    className={`
                      max-w-[80%] rounded-lg p-4
                      ${msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                      }
                    `}
                  >
                    <div className="flex items-start gap-2 mb-1">
                      {msg.role === 'assistant' && (
                        <Icon name="Bot" size={16} className="mt-1" />
                      )}
                      <span className="text-xs opacity-70">
                        {msg.role === 'user' ? 'Вы' : 'ИИ Мастер'}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <p className="text-xs opacity-50 mt-2">
                      {msg.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="border-t border-border p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Введите ваше действие или реплику..."
              className="resize-none"
              rows={2}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button type="submit" size="lg" disabled={!message.trim()}>
              <Icon name="Send" size={20} />
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2">
            Enter для отправки, Shift+Enter для новой строки
          </p>
        </div>
      </Card>
    </div>
  );
};

export default GameInterface;
