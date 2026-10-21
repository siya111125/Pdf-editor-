import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaStorage, ScrollView, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { WebView } from 'react-native-webview';

export default function App() {
  const [pdfUri, setPdfUri] = useState(null);
  const [fileName, setFileName] = useState('No document loaded');
  const [activeTool, setActiveTool] = useState('view'); // view, highlight, sign, note

  // Function to pick a PDF from phone storage (just like Adobe Reader)
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPdfUri(result.assets[0].uri);
        setFileName(result.assets[0].name);
        Alert.alert("Success", `Loaded: ${result.assets[0].name}`);
      }
    } catch (err) {
      Alert.alert("Error", "Failed to pick document: " + err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header Bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle} numberOfLines={1}>{fileName}</Text>
        <TouchableOpacity style={styles.openButton} onPress={pickDocument}>
          <Text style={styles.openButtonText}>Open PDF</Text>
        </TouchableOpacity>
      </View>

      {/* PDF Viewport Area */}
      <View style={styles.viewerContainer}>
        {pdfUri ? (
          <WebView 
            source={{ uri: `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(pdfUri)}` }}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>📄</Text>
            <Text style={styles.placeholderSubText}>Tap "Open PDF" above to load a document from your phone storage.</Text>
          </View>
        )}
      </View>

      {/* Bottom Annotation Toolbar (Adobe Style) */}
      <View style={styles.toolbar}>
        <TouchableOpacity 
          style={[styles.toolBtn, activeTool === 'view' && styles.activeTool]} 
          onPress={() => setActiveTool('view')}
        >
          <Text style={styles.toolTxt}>👁️ View</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.toolBtn, activeTool === 'highlight' && styles.activeTool]} 
          onPress={() => { setActiveTool('highlight'); Alert.alert("Tool", "Highlight mode selected. Tap text to highlight."); }}
        >
          <Text style={styles.toolTxt}>🖍️ Highlight</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.toolBtn, activeTool === 'note' && styles.activeTool]} 
          onPress={() => { setActiveTool('note'); Alert.alert("Tool", "Sticky note mode selected."); }}
        >
          <Text style={styles.toolTxt}>💬 Note</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.toolBtn, activeTool === 'sign' && styles.activeTool]} 
          onPress={() => { setActiveTool('sign'); Alert.alert("Tool", "Signature pad opened."); }}
        >
          <Text style={styles.toolTxt}>✍️ Sign</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { height: 60, backgroundColor: '#1e1e1e', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#333' },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: '600', flex: 1, marginRight: 10 },
  openButton: { backgroundColor: '#e50914', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 },
  openButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  viewerContainer: { flex: 1, backgroundColor: '#2b2b2b' },
  webview: { flex: 1, backgroundColor: 'transparent' },
  placeholderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  placeholderText: { fontSize: 50, marginBottom: 10 },
  placeholderSubText: { color: '#888', textAlign: 'center', fontSize: 15 },
  toolbar: { height: 70, backgroundColor: '#1e1e1e', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#333' },
  toolBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 },
  activeTool: { backgroundColor: '#333' },
  toolTxt: { color: '#ccc', fontSize: 13, fontWeight: '500' }
});
    
