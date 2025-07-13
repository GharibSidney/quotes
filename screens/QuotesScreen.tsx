import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import QuoteGrid from '../components/QuoteGrid';
import CreateQuoteModal from '../components/CreateQuoteModal';
import QuoteService from '../services/QuoteService';
import { Quote } from '../types/Quote';

interface Category {
  value: string;
  label: string;
}

export default function QuotesScreen(): JSX.Element {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const data = await QuoteService.list();
      setQuotes(data);
    } catch (error) {
      console.error('Error loading quotes:', error);
      Alert.alert('Error', 'Failed to load quotes');
    }
    setIsLoading(false);
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quote.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || quote.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories: Category[] = [
    { value: 'all', label: 'All Categories' },
    { value: 'inspiration', label: 'Inspiration' },
    { value: 'motivation', label: 'Motivation' },
    { value: 'love', label: 'Love' },
    { value: 'wisdom', label: 'Wisdom' },
    { value: 'success', label: 'Success' },
    { value: 'life', label: 'Life' },
    { value: 'happiness', label: 'Happiness' },
    { value: 'friendship', label: 'Friendship' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Your Quote<Text style={styles.titleGradient}> Collection</Text>
        </Text>
        <Text style={styles.subtitle}>
          Create and display your favorite quotes in beautiful, shareable widgets
        </Text>
      </View>

      <QuoteGrid 
        quotes={filteredQuotes} 
        onUpdate={loadQuotes} 
        isLoading={isLoading}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsModalOpen(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      <CreateQuoteModal
        isVisible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={loadQuotes}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 10,
  },
  titleGradient: {
    color: '#007AFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
