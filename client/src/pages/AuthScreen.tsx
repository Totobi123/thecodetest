import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Copy, Shield, Smartphone, Key, MessageCircle } from 'lucide-react';
import { deviceAuthService } from '../lib/deviceAuth';
import { telegramService } from '../lib/telegram';
import { useToast } from '@/hooks/use-toast';
// No backend API needed - pure frontend authentication

interface AuthScreenProps {
  onAuthenticated: () => void;
}

export default function AuthScreen({ onAuthenticated }: AuthScreenProps) {
  const [deviceId, setDeviceId] = useState<string>('');
  const [activationCode, setActivationCode] = useState<string>('');
  const [decodedDeviceId, setDecodedDeviceId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Get or generate device ID when component mounts
    const id = deviceAuthService.getDeviceId();
    setDeviceId(id);

    // Decode the device ID to show the activation code
    try {
      const decoded = deviceAuthService.decodeDeviceId(id);
      setDecodedDeviceId(decoded);
    } catch (error) {
      console.error('Error decoding device ID:', error);
    }

    // Check if device is already activated
    if (deviceAuthService.isDeviceActivated()) {
      onAuthenticated();
    }
  }, [onAuthenticated]);

  const copyDeviceId = () => {
    navigator.clipboard.writeText(deviceId);
    toast({
      title: "Device ID Copied",
      description: "Your device ID has been copied to clipboard",
    });
  };

  const handleActivation = async () => {
    if (!activationCode.trim()) {
      toast({
        title: "Activation Code Required",
        description: "Please enter your activation code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Pure frontend activation - verify code locally
      const isValid = deviceAuthService.verifyActivationCode(deviceId, activationCode);
      
      if (isValid) {
        deviceAuthService.setDeviceActivated();
        
        // Send Telegram notification for successful authentication
        try {
          await telegramService.notifyAuthentication(deviceId);
        } catch (error) {
          console.error('Failed to send authentication notification:', error);
        }
        
        onAuthenticated();
        toast({
          title: "Device Activated",
          description: "Your device has been successfully activated!",
        });
      } else {
        throw new Error("Invalid activation code");
      }
    } catch (error: any) {
      toast({
        title: "Activation Failed",
        description: error.message || "Invalid activation code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openWhatsApp = () => {
    const message = `Hello, I need activation for my device ID: ${deviceId}`;
    const whatsappUrl = `https://wa.me/2348071309276?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-black via-medium-gray to-deep-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="wallet-card border-gold/20 bg-gradient-to-br from-deep-black/90 to-medium-gray/90 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mx-auto w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center"
            >
              <Shield className="w-8 h-8 text-deep-black" />
            </motion.div>
            
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gold to-dark-gold bg-clip-text text-transparent">
              Device Authentication
            </CardTitle>
            
            <p className="text-muted-foreground text-sm">
              Secure your access with device-specific authentication
            </p>

            {/* Security Warning */}
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 mt-4">
              <div className="flex items-start space-x-2">
                <Shield className="text-red-400 mt-0.5 flex-shrink-0" size={16} />
                <div>
                  <div className="text-sm font-medium text-red-300">⚠️ ANTI-SCAM WARNING</div>
                  <div className="text-xs text-red-200 mt-1">
                    This is the ONLY official app. Any other contact number for activation is FAKE and will SCAM you. 
                    <br />
                    <strong>ONLY TRUST: +234 807 130 9276</strong>
                    <br />
                    Report scammers immediately!
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Device ID Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-gold" />
                <Label className="text-sm font-medium text-gold">Your Device ID</Label>
              </div>
              
              <div className="relative">
                <div className="flex items-center gap-2 p-3 bg-medium-gray/50 rounded-lg border border-gold/20">
                  <code className="flex-1 text-xs font-mono text-foreground break-all">
                    {deviceId}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyDeviceId}
                    className="text-gold hover:text-dark-gold hover:bg-gold/10"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <Badge variant="outline" className="border-gold/30 text-gold">
                Unique to this device
              </Badge>
            </div>

            <Separator className="bg-gold/20" />

            {/* WhatsApp Payment Section */}
            <div className="space-y-4">
              <div className="text-center space-y-3">
                <h3 className="text-lg font-semibold text-gold">Get Activation Code</h3>
                <p className="text-sm text-muted-foreground">
                  Send your Device ID via WhatsApp to get your activation code:
                </p>
                
                <div className="space-y-2">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={openWhatsApp}
                      className="w-full btn-gradient text-deep-black font-semibold"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp: +234 807 130 9276
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={() => {
                        const message = `Device ID: ${deviceId}\n\nHello, I need an activation code for my device.`;
                        const whatsappUrl = `https://wa.me/2349048052586?text=${encodeURIComponent(message)}`;
                        window.open(whatsappUrl, '_blank');
                      }}
                      variant="outline"
                      className="w-full border-gold/30 text-gold hover:bg-gold/10"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Alternative: 09048052586
                    </Button>
                  </motion.div>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  After verification, enter your activation code below
                </p>
              </div>
            </div>

            <Separator className="bg-gold/20" />

            {/* Activation Code Input */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-gold" />
                <Label htmlFor="activationCode" className="text-sm font-medium text-gold">
                  Activation Code
                </Label>
              </div>
              
              <Input
                id="activationCode"
                type="text"
                placeholder="Enter your activation code"
                value={activationCode}
                onChange={(e) => setActivationCode(e.target.value)}
                className="bg-medium-gray/50 border-gold/20 focus:border-gold text-foreground"
              />
              
              <Button
                onClick={handleActivation}
                disabled={isLoading || !activationCode.trim()}
                className="w-full btn-gradient text-deep-black font-semibold"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-deep-black/20 border-t-deep-black rounded-full animate-spin mr-2" />
                    Activating...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Activate Device
                  </>
                )}
              </Button>
            </div>

            {/* Info Section */}
            <div className="text-center space-y-2">
              <p className="text-xs text-muted-foreground">
                Each device requires a unique activation code
              </p>
              <p className="text-xs text-gold/80">
                Your device ID is automatically generated and stored securely
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}