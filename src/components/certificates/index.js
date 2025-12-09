import BonafideCertificate from './BonafideCertificate';
import TransferCertificate from './TransferCertificate';
import ProjectCompletionCertificate from './ProjectCompletionCertificate';
import NOC from './NOC';
import ParticipationCertificate from './ParticipationCertificate';
import AchievementCertificate from './AchievementCertificate';

export const CertificateTemplates = {
    'Bonafide Certificate': BonafideCertificate,
    'Transfer Certificate': TransferCertificate,
    'Project Completion Certificate': ProjectCompletionCertificate,
    'NOC (No Objection Certificate)': NOC,
    'Participation Certificate': ParticipationCertificate,
    'Achievement Certificate': AchievementCertificate
};

export const CertificateTypes = Object.keys(CertificateTemplates);
