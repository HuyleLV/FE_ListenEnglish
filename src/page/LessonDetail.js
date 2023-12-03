import { useCallback, useState } from "react";
import useTimer from "../component/UseTimer";
import cd from "../component/icon/cd.png"
import { Lrc, LrcLine, useRecoverAutoScrollImmediately } from "react-lrc";
import Control from "../component/Control";

export default function LessonDetail() {
    const {
      currentMillisecond,
      setCurrentMillisecond,
      reset,
      play,
      pause
    } = useTimer(4);

    const {
      signal,
      recoverAutoScrollImmediately
    } = useRecoverAutoScrollImmediately();

    return (
        <div class="max-w-screen-xl items-center mx-auto p-4">
            <p className="text-4xl text-center py-10">Lear read English</p>
            <div>
                <Control
                    onPlay={play}
                    onPause={pause}
                    onReset={reset}
                    current={currentMillisecond}
                    setCurrent={setCurrentMillisecond}
                    recoverAutoScrollImmediately={recoverAutoScrollImmediately}
                />
                <Lrc
                    lineRenderer={({ index, active, line: { content } }) => 
                        {
                            active ? <p active={active} className="text-green-600">{content}</p> 
                                : <p active={active} className="text-neutral-900">{content}</p>
                        }
                    }
                    currentMillisecond={currentMillisecond}
                    verticalSpace
                    recoverAutoScrollSingal={signal}
                    recoverAutoScrollInterval={5000}
                    lrc={
                        `
                            [00:00.90]昨夜点的灯还亮著 你的世界却暗了
                            [00:08.23]你若无其事的笑 让人 心疼
                            [00:16.17]不问你到底怎么了
                            [00:19.75]只紧紧拥抱著
                            [00:23.37]静静让你的泪冲淡苦涩和 伤痕
                            [00:32.51]
                            [00:33.50]别再哭了 别再难过了 还有我在呢
                            [00:41.06]在这一刻 别后悔了
                            [00:45.84]再多的傻和错 一笑带过
                            [00:50.38]Please don't cry everything will be fine
                            [00:55.71]放下所有遗憾 呜
                            [01:01.76]转身之后 有我为你而守候
                            [01:09.46]
                            [01:24.23]结痂的伤口 还醒著 你的天真 沉睡了
                            [01:32.14]你对爱不再期待 我该 懂了
                            [01:40.07]你说著曾被他爱著
                            [01:43.73]他和她却走了
                            [01:47.22]我懂我 只算你故事里 第三人称
                            [01:55.22]别再哭了 别再难过了 还有我在呢
                            [02:03.13]在这一刻 别后悔了
                            [02:07.78]再多的伤和痛 终会是梦
                            [02:11.96]Please don't cry everything will be fine
                            [02:17.79]拥抱你的勇敢 呜
                            [02:23.65]转身之后 有我为你而守候
                            [02:28.86]我们曾 越过曲折
                            [02:32.64]我们曾 有失有得
                            [02:36.76]我们曾 笑谈人生 有你就够了
                            [02:43.89]别再哭了 别再难过了 还有我在呢
                            [02:51.16]在这一刻 别后悔了
                            [02:55.68]再多的伤和痛 终会是梦
                            [03:00.03]Please don't cry everything will be fine
                            [03:05.70]某天再遇到爱 呜
                            [03:14.18]遗忘了我 我仍为你而守候
                        `
                    }
                />
            </div>
        </div>
    );
};