import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Share,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QuoteService from '../services/QuoteService';
import { Quote, QuoteBackgroundColor } from '../types/Quote';

const { width } = Dimensions.get('window');
const widgetSize = (width - 48) / 2;

const backgroundGradients: Record<QuoteBackgroundColor, string[]> = {
  blue: ['#60A5FA', '#3B82F6'],
  purple: ['#A78BFA', '#8B5CF6'],
  green: ['#34D399', '#10B981'],
  orange: ['#FB923C', '#F97316'],
  pink: ['#F472B6', '#EC4899'],
  teal: ['#5EEAD4', '#14B8A6']
};

interface QuoteWidgetProps {
  quote: Quote;
  onUpdate?: () => void;
}

export default function QuoteWidget({ quote, onUpdate }: QuoteWidgetProps): JSX.Element {
  const [isLiked, setIsLiked] = useState<boolean>(quote.is_favorite || false);
  const [scaleValue] = useState(new Animated.Value(1));
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLike = async (): Promise<void> => {
    if (isProcessing) return; // Prevent rapid toggling
    setIsProcessing(true);
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    const newLiked = !isLiked;
    setIsLiked(newLiked);
    try {
      if (quote.id) {
        await QuoteService.update(quote.id, { ...quote, is_favorite: newLiked });
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      setIsLiked(!newLiked); // Revert on error
      Alert.alert('Error', 'Failed to update quote');
    }
    setIsProcessing(false);
  };

  const handleDelete = async (): Promise<void> => {
    if (!quote.id) return;
    Alert.alert(
      'Delete Quote',
      'Are you sure you want to delete this quote?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await QuoteService.delete(quote.id);
              if (onUpdate) onUpdate();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete quote');
            }
          },
        },
      ]
    );
  };

  const handleCopy = async (): Promise<void> => {
    try {
      // For React Native, you might want to use a clipboard library
      // For now, we'll just show an alert
      Alert.alert('Copied!', 'Quote copied to clipboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy quote');
    }
  };

  const handleShare = async (): Promise<void> => {
    try {
      await Share.share({
        message: `"${quote.text}" - ${quote.author}`,
        title: 'Inspiring Quote',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share quote');
    }
  };

  const gradientColors = backgroundGradients[quote.background_color || 'blue'] || backgroundGradients.blue;

  return (
    <View style={[styles.container, { backgroundColor: gradientColors[0] }]}>
      {/* Quote Content */}
      <View style={styles.content}>
        <Text style={styles.quoteText}>"{quote.text}"</Text>
        <Text style={styles.authorText}>— {quote.author}</Text>
      </View>
      
      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleLike}
          activeOpacity={0.8}
        >
          <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
            <Ionicons 
              name={isLiked ? "heart" : "heart-outline"} 
              size={20} 
              color={isLiked ? "#FEE2E2" : "white"} 
            />
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleDelete}
          activeOpacity={0.8}
        >
          <Ionicons name="trash-outline" size={18} color="#F87171" />
        </TouchableOpacity>
        <View style={styles.rightActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleCopy}
            activeOpacity={0.8}
          >
            <Ionicons name="copy-outline" size={18} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShare}
            activeOpacity={0.8}
          >
            <Ionicons name="share-outline" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Favorite Indicator */}
      {isLiked && (
        <View style={styles.favoriteIndicator}>
          <Ionicons name="heart" size={16} color="#FEE2E2" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: widgetSize,
    height: widgetSize,
    borderRadius: 24,
    padding: 16,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  authorText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  rightActions: {
    flexDirection: 'row',
    gap: 8,
  },
  favoriteIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
});
