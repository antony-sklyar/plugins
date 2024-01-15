// @flow
 
import pluginJson from '../plugin.json'
import { log, logDebug, logError, logWarn, clo, JSP } from '@helpers/dev'
import { createRunPluginCallbackUrl } from '@helpers/general'

// eslint-disable-next-line require-await
export async function sendToOmniFocus(): Promise<void> {
    
    console.log('Sending to OmniFocus started...');
    
    let noteTitle = Editor.title;
    let noteUrl = 'noteplan://x-callback-url/openNote?noteTitle=' + encodeURIComponent(noteTitle);
    let omniFocusContent = '- ' + noteTitle + '\n\t[Open in NotePlan](' + noteUrl + ')';
    
    let noteLines = Editor.paragraphs;
    console.log(noteLines.length);
    noteLines.forEach(function (paragraph) {
        console.log('paragraph processing');
        console.log(paragraph.type);
        console.log(paragraph.indents);
        
        if (paragraph.type != 'open') return;
        
        let prefix = '\t';
        for (let i = 0; i <= paragraph.indents; i++) prefix += '\t';
        omniFocusContent += '\n' + prefix + '- ';
        
        let taskName = paragraph.content;
        
        let tags = [...taskName.matchAll(/#([a-zA-Z0-9\-]+\/)*[a-zA-Z0-9\-]+/g)];
        console.log(tags);
        // TODO: transform #nested/hash-tag into "Hash Tag"
        
        let mentions = [...taskName.matchAll(/@([a-zA-Z0-9\-]+\/)*[a-zA-Z0-9\-]+/g)];
        console.log(mentions);
         // TODO: transform @team/jsmith into "J.Smith"
        
        if (paragraph.date) {
            taskName = taskName.replace(/>\d{4}\-\d{2}\-\d{2}/, '');
            taskName = taskName.replace('>today', '');
            taskName += ' @due(' + paragraph.date.toISOString().slice(0, 10) + ')';
        }
        
        omniFocusContent += taskName;
    });
    
    console.log(omniFocusContent)
    let omniFocusUrl = 'omnifocus://x-callback-url/paste?content=' + encodeURIComponent(omniFocusContent);
    
    NotePlan.openURL(omniFocusUrl);
    
    console.log('Sending to OmniFocus finished.');

}
