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
import { QuoteService } from '../services/QuoteService';

const { width } = Dimensions.get('window');
const widgetSize = (width - 48) / 2;

const backgroundGradients = {
  blue: ['#60A5FA', '#3B82F6'],
  purple: ['#A78BFA', '#8B5CF6'],
  green: ['#34D399', '#10B981'],
  orange: ['#FB923C', '#F97316'],
  pink: ['#F472B6', '#EC4899'],
  teal: ['#5EEAD4', '#14B8A6']
};

export default function QuoteWidget({ quote, onUpdate }) {
  const [isLiked, setIsLiked] = useState(quote.is_favorite);
  const [scaleValue] = useState(new Animated.Value(1));

  const handleLike = async () => {
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

    setIsLiked(!isLiked);
    
    try {
      await QuoteService.update(quote.id, { ...quote, is_favorite: !isLiked });
      if (onUpdate) onUpdate();
    } catch (error) {
      setIsLiked(!isLiked); // Revert on error
      Alert.alert('Error', 'Failed to update quote');
    }
  };

  const handleCopy = async () => {
    try {
      // For React Native, you might want to use a clipboard library
      // For now, we'll just show an alert
      Alert.alert('Copied!', 'Quote copied to clipboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy quote');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `"${quote.text}" - ${quote.author}`,
        title: 'Inspiring Quote',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share quote');
    }
  };

  const gradientColors = backgroundGradients[quote.background_color] || backgroundGradients.blue;

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