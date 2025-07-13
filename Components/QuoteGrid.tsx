import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Dimensions,
  ListRenderItem,
} from 'react-native';
import QuoteWidget from './QuoteWidget';
import { Quote } from '../types/Quote';

const { width } = Dimensions.get('window');
const numColumns = width > 768 ? 3 : width > 480 ? 2 : 1;

interface QuoteGridProps {
  quotes: Quote[];
  onUpdate: () => void;
  isLoading: boolean;
}

export default function QuoteGrid({ quotes, onUpdate, isLoading }: QuoteGridProps): JSX.Element {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading quotes...</Text>
      </View>
    );
  }

  if (quotes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIcon}>
          <Text style={styles.emptyEmoji}>💭</Text>
        </View>
        <Text style={styles.emptyTitle}>No quotes yet</Text>
        <Text style={styles.emptySubtitle}>
          Start building your collection of inspiring quotes. Create your first quote to get started!
        </Text>
      </View>
    );
  }

  const renderItem: ListRenderItem<Quote> = ({ item, index }) => (
    <View style={styles.quoteContainer}>
      <QuoteWidget quote={item} onUpdate={onUpdate} />
    </View>
  );

  return (
    <FlatList
      data={quotes}
      renderItem={renderItem}
      keyExtractor={(item, index) => item.id?.toString() || index.toString()}
      numColumns={numColumns}
      columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
      contentContainerStyle={styles.gridContainer}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  gridContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
  },
  quoteContainer: {
    flex: 1,
    marginHorizontal: 4,
    marginBottom: 16,
  },
});
