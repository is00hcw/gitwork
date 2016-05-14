import static org.eclipse.swtbot.swt.finder.waits.Conditions.shellCloses;
 
import org.eclipse.swtbot.eclipse.finder.SWTWorkbenchBot;
import org.eclipse.swtbot.swt.finder.junit.SWTBotJunit4ClassRunner;
import org.eclipse.swtbot.swt.finder.widgets.SWTBotShell;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
 
@RunWith(SWTBotJunit4ClassRunner.class)
public class SampleMenuTest {
 
    private static SWTWorkbenchBot bot;
 
    @BeforeClass
    public static void initBot() {
        bot = new SWTWorkbenchBot();
        bot.viewByTitle("Welcome").close();
    }
 
    @AfterClass
    public static void afterClass() {
        bot.resetWorkbench();
    }
 
    @Test
    public void testSampleMenu() {
        bot.menu("Sample Menu").menu("Sample Command").click();
        SWTBotShell dialog = bot.shell("Example Menu");
        dialog.activate();
        bot.label("Hello, Eclipse world");
        bot.button("OK").click();
        bot.waitUntil(shellCloses(dialog));
    }
}