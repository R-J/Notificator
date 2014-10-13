<?php defined('APPLICATION') or die;

$PluginInfo['Notificator'] = array(
    'Name' => 'Notificator',
    'Description' => 'Updates MeBox notification and message counter and shows notification count in favicon.',
    'Version' => '0.1',
    'RequiredApplications' => array('Vanilla' => '2.1'),
    'MobileFriendly' => true,
    'Author' => 'Robin Jurinka',
    'License' => 'MIT'
);

/**
 * Inserts JS that hooks Vanillas pingForNotifications and updates message and
 * notification count based on the information that is provided by
 * /dashboard/notifications/inform. Favicon is updated with notification count
 * as well.
 */
class NotificatorPlugin extends Gdn_Plugin {
    /**
     * Inserts plugins JS code.
     *
     * @param Gdn_Controller $Sender 
     */
    public function base_render_before ($Sender) {
        $Sender->AddJsFile('notificator.js', 'plugins/Notificator');
    }
}
