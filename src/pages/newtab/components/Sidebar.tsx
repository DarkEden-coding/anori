import { FolderButton } from "@components/FolderButton";
import { Modal } from "@components/Modal";
import { ScrollArea } from "@components/ScrollArea";
import { ShortcutsHelp } from "@components/ShortcutsHelp";
import { FloatingDelayGroup } from "@floating-ui/react";
import { useHotkeys } from "@utils/hooks";
import { useBrowserStorageValue } from "@utils/storage/api";
import { Folder } from "@utils/user-data/types";
import { AnimatePresence } from "framer-motion";
import { lazy, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";
import './Sidebar.scss';



const SettingsModal = lazy(() => import('../settings/Settings').then(m => ({ 'default': m.SettingsModal })));
const WhatsNew = lazy(() => import('@components/WhatsNew').then(m => ({ 'default': m.WhatsNew })));

export type SidebarProps = {
    folders: Folder[],
    activeFolder: Folder,
    orientation: 'vertical' | 'horizontal',
    onFolderClick: (folder: Folder) => void;
}

export const Sidebar = ({ folders, activeFolder, orientation, onFolderClick }: SidebarProps) => {
    const { t } = useTranslation();
    const [hasUnreadReleaseNotes, setHasUnreadReleaseNotes] = useBrowserStorageValue('hasUnreadReleaseNotes', false);
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [shortcutsHelpVisible, setShortcutsHelpVisible] = useState(false);
    const [whatsNewVisible, setWhatsNewVisible] = useState(false);

    useHotkeys('alt+h', () => setShortcutsHelpVisible(v => !v));
    useHotkeys('alt+s', () => setSettingsVisible(v => !v));


    return (<>
        <div className='sidebar-wrapper'>
            <ScrollArea
                className="sidebar"
                contentClassName='sidebar-viewport'
                color='translucent'
                type='hover'
                direction={orientation}
                mirrorVerticalScrollToHorizontal
            >
                <div className="sidebar-content">
                    <FloatingDelayGroup delay={{ open: 50, close: 50 }}>
                        {folders.map(f => {
                            return (<FolderButton
                                dropDestination={{ id: f.id }}
                                sidebarOrientation={orientation}
                                key={f.id}
                                icon={f.icon}
                                name={f.name}
                                active={activeFolder === f}
                                onClick={() => {
                                    onFolderClick(f);
                                }}
                            />);
                        })}
                        <div className="spacer" />
                        <FolderButton
                            sidebarOrientation={orientation}
                            layoutId='whats-new'
                            icon="ion:newspaper-outline"
                            name={t('whatsNew')}
                            withRedDot={hasUnreadReleaseNotes}
                            onClick={() => {
                                setWhatsNewVisible(true);
                                setHasUnreadReleaseNotes(false);
                            }}
                        />
                        <FolderButton
                            sidebarOrientation={orientation}
                            layoutId='settings'
                            icon="ion:settings-sharp"
                            name={t('settings.title')}
                            onClick={() => setSettingsVisible(true)}
                        />
                    </FloatingDelayGroup>
                </div>
            </ScrollArea>
        </div>
        {shortcutsHelpVisible && <Modal title={t('shortcuts.title')} key='shortcuts' closable onClose={() => setShortcutsHelpVisible(false)}>
            <ShortcutsHelp />
        </Modal>}

        {whatsNewVisible && <Modal title={t('whatsNew')} className='WhatsNew-modal' key='whats-new' closable onClose={() => setWhatsNewVisible(false)}>
            <Suspense fallback={undefined}>
                <WhatsNew />
            </Suspense>
        </Modal>}

        <Suspense key='settings' fallback={undefined}>
            <AnimatePresence>
                {settingsVisible && <SettingsModal onClose={() => setSettingsVisible(false)} />}
            </AnimatePresence>
        </Suspense>
    </>);
};