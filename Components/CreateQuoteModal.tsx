import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QuoteService from '../services/QuoteService';
import { QuoteCategory, QuoteBackgroundColor, CreateQuoteData } from '../types/Quote';
import ColorPanel  from './ColorPanel';
import Slider from '@react-native-community/slider';

interface CreateQuoteModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: () => void;
}

interface CategoryOption {
  value: QuoteCategory;
  label: string;
}

interface ColorOption {
  value: QuoteBackgroundColor;
  label: string;
  colors: string[];
}

const categories: CategoryOption[] = [
  { value: 'inspiration', label: 'Inspiration' },
  { value: 'motivation', label: 'Motivation' },
  { value: 'love', label: 'Love' },
  { value: 'wisdom', label: 'Wisdom' },
  { value: 'success', label: 'Success' },
  { value: 'life', label: 'Life' },
  { value: 'happiness', label: 'Happiness' },
  { value: 'friendship', label: 'Friendship' }
];

export default function CreateQuoteModal({ isVisible, onClose, onSave }: CreateQuoteModalProps): JSX.Element {
  const [formData, setFormData] = useState<CreateQuoteData>({
    text: '',
    author: '',
    category: 'inspiration',
    background_color: 'blue', // fallback to a valid union value
    is_favorite: false
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hue, setHue] = useState(210); // default to blue

  // Convert hue to hex color (full saturation and value)
  function hsvToHex(h: number, s = 1, v = 1) {
    let f = (n: number, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
    let r = Math.round(f(5) * 255);
    let g = Math.round(f(3) * 255);
    let b = Math.round(f(1) * 255);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  React.useEffect(() => {
    // Only update if type allows string, otherwise fallback to 'blue'
    if (typeof formData.background_color === 'string') {
      const hex = hsvToHex(hue);
      setFormData((prev) => ({ ...prev, background_color: hex as QuoteBackgroundColor }));
    }
  }, [hue]);

  const handleSubmit = async (): Promise<void> => {
    if (!formData.text.trim() || !formData.author.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await QuoteService.create(formData);
      setFormData({
        text: '',
        author: '',
        category: 'inspiration',
        background_color: 'blue', // Reset to default on success
        is_favorite: false
      });
      onSave();
      onClose();
    } catch (error) {
      console.error('Error creating quote:', error);
      Alert.alert('Error', 'Failed to create quote');
    }
    setIsSubmitting(false);
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create Quote</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Quote Text</Text>
            <TextInput
              style={styles.textArea}
              value={formData.text}
              onChangeText={(text) => setFormData({ ...formData, text })}
              placeholder="Enter your inspiring quote..."
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Author</Text>
            <TextInput
              style={styles.input}
              value={formData.author}
              onChangeText={(author) => setFormData({ ...formData, author })}
              placeholder="Who said this?"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Background Color</Text>
            <View style={{ marginBottom: 8 }}>
              <Slider
                minimumValue={0}
                maximumValue={360}
                step={1}
                value={hue}
                onValueChange={setHue}
                minimumTrackTintColor="#888"
                maximumTrackTintColor="#d1d5db"
                thumbTintColor={typeof formData.background_color === 'string' ? formData.background_color : '#60A5FA'}
              />
            </View>
            <Text style={styles.colorLabel}>{typeof formData.background_color === 'string' ? formData.background_color : ''}</Text>
          </View>

          <View>
            <ColorPanel />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Preview</Text>
            <View style={[styles.preview, { backgroundColor: typeof formData.background_color === 'string' ? formData.background_color : '#60A5FA' }]}>
              <Text style={styles.previewText}>
                "{formData.text || 'Your quote here...'}"
              </Text>
              <Text style={styles.previewAuthor}>
                — {formData.author || 'Author'}
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.createButton, (!formData.text.trim() || !formData.author.trim()) && styles.createButtonDisabled]}
            onPress={handleSubmit}
            disabled={!formData.text.trim() || !formData.author.trim() || isSubmitting}
          >
            <Text style={styles.createButtonText}>
              {isSubmitting ? 'Creating...' : 'Create Quote'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: 'white' },
  headerTitle: { fontSize: 20, fontWeight: '600', color: '#1F2937' },
  content: { flex: 1, padding: 20 },
  inputGroup: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  input: { backgroundColor: 'white', borderRadius: 12, padding: 16, fontSize: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  textArea: { backgroundColor: 'white', borderRadius: 12, padding: 16, fontSize: 16, borderWidth: 1, borderColor: '#E5E7EB', minHeight: 100, textAlignVertical: 'top' },
  preview: { borderRadius: 16, padding: 16, alignItems: 'center', minHeight: 80 },
  previewText: { fontSize: 14, fontWeight: '500', color: 'white', textAlign: 'center', marginBottom: 4 },
  previewAuthor: { fontSize: 12, color: 'rgba(255, 255, 255, 0.9)', fontWeight: '500' },
  actions: { flexDirection: 'row', padding: 20, gap: 12 },
  cancelButton: { flex: 1, paddingVertical: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: 'white', alignItems: 'center' },
  cancelButtonText: { fontSize: 16, fontWeight: '500', color: '#6B7280' },
  createButton: { flex: 1, paddingVertical: 16, borderRadius: 12, backgroundColor: '#007AFF', alignItems: 'center' },
  createButtonDisabled: { backgroundColor: '#D1D5DB' },
  createButtonText: { fontSize: 16, fontWeight: '500', color: 'white' },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    marginTop: 12,
    marginBottom: 0, // Reduced to remove extra space
    rowGap: 12,
    columnGap: 12,
  },
  colorOption: {
    flexBasis: '30%', // 3 per row, more even
    minWidth: 10,
    aspectRatio: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 1,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColorOption: {
    borderColor: '#007AFF',
  },
  colorLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginTop: 1, // Reduced
    marginBottom: 8, // Add a little space before preview
    textAlign: 'center',
  },
  pickColorButton: {
    backgroundColor: '#60A5FA',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  pickColorButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  colorPickerModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  colorPickerModalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '90%',
    height: '60%',
    padding: 20,
    alignItems: 'center',
  },
  closeColorPickerButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
  },
  closeColorPickerButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
});
