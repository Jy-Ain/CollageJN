/// <reference lib="dom" />

interface Window {
  showDirectoryPicker?: () => Promise<FileSystemDirectoryHandle>;
}

interface FileSystemDirectoryHandle {
  values: () => AsyncIterableIterator<FileSystemHandle>;
}

interface FileSystemFileHandle extends FileSystemHandle {
  getFile: () => Promise<File>;
}

interface FileSystemHandle {
  kind: 'file' | 'directory';
  name: string;
}
