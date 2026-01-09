import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const paths = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), '../.env'),
    path.resolve(__dirname, '../../.env'),
];

console.log('Current CWD:', process.cwd());

paths.forEach(p => {
    if (fs.existsSync(p)) {
        console.log(`File exists: ${p}`);
        try {
            const content = fs.readFileSync(p, 'utf8');
            console.log(`  Read ${content.length} characters.`);
            console.log(`  First 20 chars: ${content.substring(0, 20).replace(/\n/g, '\\n')}`);

            const parsed = dotenv.parse(content);
            console.log(`  Keys found: ${Object.keys(parsed).join(', ')}`);
            if (parsed.TWILIO_ACCOUNT_SID) {
                console.log(`  TWILIO_ACCOUNT_SID found: Yes (starts with ${parsed.TWILIO_ACCOUNT_SID.substring(0, 2)})`);
            } else {
                console.log(`  TWILIO_ACCOUNT_SID found: NO`);
            }
        } catch (e: any) {
            console.error(`  Error reading file: ${e.message}`);
        }
    } else {
        console.log(`File NOT found: ${p}`);
    }
});
