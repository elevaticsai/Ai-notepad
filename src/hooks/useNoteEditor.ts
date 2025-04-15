import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import styles from '../components/editor/Editor.module.css';

const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '100%',
        renderHTML: attributes => ({
          width: attributes.width,
        }),
      },
      height: {
        default: 'auto',
        renderHTML: attributes => ({
          height: attributes.height,
        }),
      },

    }
  },
  addNodeView() {
    return ({ node, getPos, editor }) => {
      const container = document.createElement('div')
      container.className = styles.imageResizer
      
      const img = document.createElement('img')
      Object.entries(node.attrs).forEach(([key, value]) => {
        img.setAttribute(key, value)
      })
      
      container.append(img)
      
      // Add resize handles
      const positions = ['nw', 'ne', 'sw', 'se']
      let startX: number, startY: number, startWidth: number, startHeight: number
      let currentHandle: string
      
      positions.forEach(pos => {
        const handle = document.createElement('div')
        const posClass = `${pos.charAt(0).toUpperCase()}${pos.charAt(1).toLowerCase()}`
        handle.className = `${styles.resizeHandle} ${styles[`resizeHandle${posClass}`]}`
        
        handle.addEventListener('mousedown', (event: MouseEvent) => {
          event.preventDefault()
          isResizing = true
          currentHandle = pos
          startX = event.pageX
          startY = event.pageY
          startWidth = img.offsetWidth
          startHeight = img.offsetHeight
          document.addEventListener('mousemove', resize)
          document.addEventListener('mouseup', stopResize)
        })
        
        container.appendChild(handle)
      })
      
      const resize = (event: MouseEvent) => {
        event.preventDefault()
        const dx = event.pageX - startX
        const dy = event.pageY - startY
        
        let newWidth = startWidth
        let newHeight = startHeight
        let left = 0
        let top = 0
        
        switch(currentHandle) {
          case 'se':
            newWidth = startWidth + dx
            newHeight = startHeight + dy
            break
          case 'sw':
            newWidth = startWidth - dx
            newHeight = startHeight + dy
            left += dx
            break
          case 'ne':
            newWidth = startWidth + dx
            newHeight = startHeight - dy
            top += dy
            break
          case 'nw':
            newWidth = startWidth - dx
            newHeight = startHeight - dy
            left += dx
            top += dy
            break
        }
        
        // Ensure minimum size
        newWidth = Math.max(50, newWidth)
        newHeight = Math.max(50, newHeight)
        
        // Maintain aspect ratio
        const aspectRatio = startWidth / startHeight
        if (newWidth / newHeight !== aspectRatio) {
          if (newWidth / aspectRatio > newHeight) {
            newWidth = newHeight * aspectRatio
          } else {
            newHeight = newWidth / aspectRatio
          }
        }
        
        // Update position and size
        container.style.left = `${left}px`
        container.style.top = `${top}px`
        img.style.width = `${newWidth}px`
        img.style.height = `${newHeight}px`
      }
      
      let isResizing = false;
      
      const stopResize = () => {
        if (!isResizing) return;
        
        document.removeEventListener('mousemove', resize)
        document.removeEventListener('mouseup', stopResize)
        
        // Update the node attributes when resizing is complete
        try {
          if (typeof getPos === 'function' && editor?.view) {
            const pos = getPos();
            const node = editor.view.state.doc.nodeAt(pos);
            if (node) {
              editor.view.dispatch(editor.view.state.tr.setNodeMarkup(
                pos,
                undefined,
                {
                  ...node.attrs,
                  width: img.style.width,
                  height: img.style.height
                }
              ))
            }
          }
        } catch (e) {
          console.warn('Failed to update image dimensions:', e);
        }
        
        isResizing = false;
      }
      
      return {
        dom: container,
        destroy: () => {
          container.querySelectorAll(`.${styles.resizeHandle}`).forEach(handle => {
            handle.remove()
          })
          // Only remove event listeners, don't try to update node
          document.removeEventListener('mousemove', resize)
          document.removeEventListener('mouseup', stopResize)
        },
      }
    }
  },
});

export const useNoteEditor = (onSelectionUpdate?: (text: string) => void) => {
  return useEditor({
    extensions: [StarterKit, TextStyle, Color, Highlight, ResizableImage],
    content: "",
    onSelectionUpdate: ({ editor }) => {
      const selection = editor.state.selection;
      const text = editor.state.doc.textBetween(selection.from, selection.to);
      onSelectionUpdate?.(text);
    },
  });
};
